package main

// Schema definition of esback config file
type EsbackConfig struct {
	Metadata Metadata   `json:"metadata" yaml:"metadata"`
	Plugins  PluginSpec `json:"plugins" yaml:"plugins"`
}

type Metadata struct {
	Author  *string `json:"author,omitempty" yaml:"author,omitempty"`
	Name    string  `json:"name" yaml:"name"`
	Version string  `json:"version" yaml:"version"`
}

type PluginSpec struct {
	App     []PluginConfig `json:"app,omitempty" yaml:"app,omitempty"`
	Backend []PluginConfig `json:"backend,omitempty" yaml:"backend,omitempty"`
}

type PluginConfig struct {
	Config map[string]interface{} `json:"config,omitempty" yaml:"config,omitempty"`
	Name   string                 `json:"name" yaml:"name"`
}
