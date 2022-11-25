# Techdocs

This directory contains:
- docs: contains md files for generating techdocs
- mkdocs.yaml: instructions for building techdocs
- output: contains pre-built sample techdocs

We use pre-built techdocs in the output folder for our integration tests. Techdocs require the presence of docker or the mkdocs cli in order to build md files into static web files. This means that our esback:integration image would require docker in docker, or the mkdocs cli to be installed. To avoid this, we set our e2e techdocs to skip building and render pre-built techdocs from the output directory. We do this via a volume mount in our docker-compose.yaml.