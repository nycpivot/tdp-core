## Cloud Native Buildpacks

This folder contains the necessary files to create a custom stack, builder and buildpack
for ESBack.

The basic idea is as follows:

- The builder image of the custom stack will contain the source code of the esback `core`
- The esback buildpack will take a folder with a single `esback-config.yml` file and will
  generate a new esback instance from it. This instance will be added to the runnable image
  in a layer called *server* which will be set up in the `launch.toml` config to start the
  node process by default

This is basically a POC, and there are several things hacked out to make this work:

1. The /foundation folder in the stack-builder image has mode 777, to avoid issues when
copying it to the *server* layer
2. The 'offline cache' system is included but hasn't being properly tested yet
3. The base image for the esback-stack was based from ubuntu bionic and glued together on
  a rush. There might be a better suited image to be the "base of the base"

## Running locally

You will need to do a couple of steps in order to test this out locally. First, make sure
you have [pack](https://buildpacks.io/docs/tools/pack/) and docker installed on your machine.

To generate the esback-stack locally and create the custom esback-builder, simply run the
`setup.sh` script from the root folder of this repo:

```sh
$ ./cnb/setup.sh
```

This will create the *esback-stack-builder* and *esback-stack-runner* images locally, as
well as an esback builder based on _cnb/builder.toml_.

Once this is done, you can generate a new esback instance with *pack*. For example, to 
generate an image named *esback-test* using the esback config file under ./examples, you
can run:

```sh
$ pack build esback-test --builder esback-builder --buildpack ./cnb/buildpack --path examples
```

You can then run the instance with docker:

```sh
$ docker run --rm -p 7007:7007 esback-test
```

If needed, you an also provide a custom `app-config.yaml` file to be included in the runnable
esback instance during the build process. To do this, make sure to add the file to the folder
provided in the `--path` flag. e.g:

```sh
$ mkdir esback
$ cp esback-config.yml app-config.yaml esback
$ pack build esback-test --builder esback-builder --buildpack ./cnb/buildpack --path esback
```
