package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	var configFile = flag.String("f", "", "Esback config file")
	flag.Parse()

	if *configFile == "" {
		fmt.Fprintln(os.Stderr, "No config file provided")
		os.Exit(1)
	}

	BuildNewInstance(*configFile)
}
