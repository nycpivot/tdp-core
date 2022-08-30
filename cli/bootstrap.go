package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

type TemplateConfig struct {
	fileTemplate   string
	pluginTemplate string
}

var templateConfig = map[string]*TemplateConfig{
	"app": &TemplateConfig{
		fileTemplate: `import { AppPluginExport } from '@esback/core';
export const esbackPlugins = async (): Promise<AppPluginExport[]> => [
%s]`,
		pluginTemplate: "%s  (await import('%s')).default(),\n",
	},
	"backend": &TemplateConfig{
		fileTemplate: `import { BackendPluginInterface } from '@esback/core';
export const esbackPlugins = async (): Promise<BackendPluginInterface[]> => [
%s]`,
		pluginTemplate: "%s  (await import('%s')).default,\n",
	},
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

	config := templateConfig[pkg]

	importStatement := ""

	for _, plugin := range plugins {
		if !strings.HasPrefix(plugin.Name, "@internal") {
			yarnAdd(path, pkg, plugin.Name)
		}

		importStatement = fmt.Sprintf(config.pluginTemplate, importStatement, plugin.Name)
	}

	pluginFile := filepath.Join(path, "packages", pkg, "src", "core", "plugins.ts")
	return ioutil.WriteFile(pluginFile, []byte(fmt.Sprintf(config.fileTemplate, importStatement)), 0644)
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
