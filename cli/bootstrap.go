package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

var esbackPluginsTemplate = `import { %[1]s } from '@esback/core';
%[2]s
export const esbackPlugins = async (): Promise<%[1]s[]> => [
%[3]s]
`

var templateConfig = map[string]string{
	"app":     "AppPluginExport",
	"backend": "BackendPluginExport",
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
	configObjects := ""

	for i, plugin := range plugins {
		configObject := ""
		if !strings.HasPrefix(plugin.Name, "@internal") {
			yarnAdd(path, pkg, plugin.Name)
		}

		if len(plugin.Config) > 0 {
			configObject = fmt.Sprintf("esbackConfig%d", i)
			jsonConfig, err := json.Marshal(plugin.Config)

			if err != nil {
				return err
			}

			configObjects = fmt.Sprintf("%s\nconst %s = %s", configObjects, configObject, jsonConfig)
		}

		importStatement = fmt.Sprintf("%s  (await import('%s')).default(%s),\n", importStatement, plugin.Name, configObject)
	}

	pluginFile := filepath.Join(path, "packages", pkg, "src", "core", "plugins.ts")
	return ioutil.WriteFile(pluginFile, []byte(fmt.Sprintf(esbackPluginsTemplate, templateConfig[pkg], configObjects, importStatement)), 0644)
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
