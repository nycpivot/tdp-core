package main

import (
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

var importTemplate = map[string]string{
	"app":     "%s\n    (await import('%s')).default(),",
	"backend": "%s\n    (await import('%s')).default,",
}

func cloneFoundation(path string) error {
	return nil
}

func loadConfig(configFile string) (*EsbackConfig, error) {
	yfile, err := ioutil.ReadFile(configFile)

	if err != nil {
		return nil, err
	}

	builderConfig := &EsbackConfig{}
	err = yaml.Unmarshal(yfile, builderConfig)

	return builderConfig, err
}

func addPlugins(path string, pkg string, plugins []PluginConfig) error {
	if len(plugins) == 0 {
		return nil
	}

	importStatement := ""

	for _, plugin := range plugins {
		if !strings.HasPrefix(plugin.Name, "@internal") {
			yarnAdd(path, pkg, plugin.Name)
		}

		importStatement = fmt.Sprintf(importTemplate[pkg], importStatement, plugin.Name)
	}

	return injectIntoSurface(filepath.Join(path, "packages", pkg), "{{esback:plugin:imports}}", importStatement)
}

func terminate(message string, err error) {
	fmt.Fprintf(os.Stderr, message+"\n", err)
	os.Exit(1)
}

func yarnAdd(path string, pkg string, library string) error {
	yarnAdd := exec.Command("yarn", "add", "--cwd", "packages/"+pkg, library)

	yarnAdd.Dir = path
	yarnAdd.Stdout = os.Stdout

	return yarnAdd.Run()
}

func injectIntoSurface(path string, surface string, code string) error {
	injectDone := errors.New("code injected successfully") // due to WalkDir function it needs to be handled like an error
	rgxstr := ".*" + regexp.QuoteMeta(surface) + ".*"
	surfaceRgx := regexp.MustCompile(rgxstr)

	err := filepath.WalkDir(path, func(currentPath string, d fs.DirEntry, err error) error {
		if d.IsDir() && (d.Name() == "node_modules" || d.Name() == "dist") {
			return fs.SkipDir
		}

		if !d.IsDir() {
			f, err2 := ioutil.ReadFile(currentPath)

			if err2 == nil {
				foundSurface := surfaceRgx.Find(f)

				if foundSurface != nil {
					codeInjectionStr := string(foundSurface) + "\n" + code
					result := surfaceRgx.ReplaceAll(f, []byte(codeInjectionStr))

					err2 = ioutil.WriteFile(currentPath, result, 0644)

					if err2 != nil {
						return err2
					}

					return injectDone
				}
			}
		}

		return nil
	})

	// Don't propagate a successfull patch as an error
	if err == injectDone {
		return nil
	}

	if err == nil {
		return fmt.Errorf("Failed to find surface %s in code base", surface)
	}

	return err
}

func BuildNewInstance(configFile string) {
	config, err := loadConfig(configFile)

	if err != nil {
		terminate("Failed to load config values:\n%s", err)
	}

	path, err := os.Getwd()

	if err != nil {
		terminate("Error loading target path:\n%s", err)
	}

	fmt.Printf("Running esback bootstrap for %s\n", path)

	err = addPlugins(path, "app", config.Plugins.App)

	if err != nil {
		terminate("Error adding frontend plugins:\n%s", err)
	}

	addPlugins(path, "backend", config.Plugins.Backend)

	if err != nil {
		terminate("Error adding backend plugins:\n%s", err)
	}

	fmt.Println("Your ESBack instance has been properly configured!")
}
