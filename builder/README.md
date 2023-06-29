# Creating a builder

Creating the builder is a docker build command based out of the `builder` directory within our `core` repo.

From the root of the repo you could run

```shell
$ cd builder
$ docker build . -t builder
```

This will take a few minutes as it downloads all the dependencies the builder
needs to create Dev Portal app images.

# Pushing the builder to a registry

Same as any other docker image

```shell
$ docker tag builder REGISTRY/LOCATION:TAG
$ docker push REGISTRY/LOCATION:TAG
```

For example:

```shell
$ docker tag builder mstergianis.azurecr.io/tpb:latest
$ docker push mstergianis.azurecr.io/tpb:latest
```

note: in the example you will have to authenticate with the azurecr registry with:

```shell
$ az login # with your vmware email address
$ az account set --subscription 104507bd-7c78-486e-87c6-00591f9bee45
$ az acr login -n mstergianis
```

# Using the builder image within a supply chain

The interface for running the builder is to issue a workload to a TAP cluster
with sufficient configuration to run an image through a supply chain.

For the sake of this doc we will be using a cluster that has already been set
up. If you do not have access to a cluster that has supply chains ready to go,
the TAP testbeds may be your best bet.

In this example we'll be using the [PSTAR-911
cluster](https://console.cloud.google.com/kubernetes/clusters/details/us-central1-c/pstar-911/details?project=tap-activation-program)
that is on GCP.

Here is an example workload yaml that you could modify to issue to the cluster

```yaml
apiVersion: carto.run/v1alpha1
kind: Workload
metadata:
  labels:
    app.kubernetes.io/part-of: tpb
    apps.tanzu.vmware.com/has-tests: 'true'
    apps.tanzu.vmware.com/workload-type: web
  name: mstergianis-builder-run
  namespace: default
spec:
  build:
    env:
      - name: BP_NODE_RUN_SCRIPTS
        value: set-app-config,set-tpb-config,portal:pack
      - name: TPB_CONFIG
        value: /tmp/tpb-config.yaml
      - name: TPB_CONFIG_STRING
        value: YXBwOgogIHBsdWdpbnM6CiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1ycnYnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1hcHAtbGl2ZS12aWV3JwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tYXp1cmUtYXV0aCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWdpdGxhYi1hdXRoJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tZ29vZ2xlLWF1dGgnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1hdXRoMC1hdXRoJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tb2t0YS1hdXRoJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tYml0YnVja2V0LWF1dGgnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1vbmVsb2dpbi1hdXRoJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tb2lkYy1hdXRoJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tZ2l0aHViLWF1dGgnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1ndWVzdC1hdXRoJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tZ2l0bGFiLWxvYmxhdycKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWFwaS1zY29yaW5nJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tYXBwLWFjY2VsZXJhdG9yLXNjYWZmb2xkZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1wZW5kby1hbmFseXRpY3MnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1zZWN1cml0eS1hbmFseXNpcy1mcm9udGVuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLXN1cHBseS1jaGFpbicKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLXZtd2FyZS1jbG91ZC1zZXJ2aWNlcy1hdXRoJwpiYWNrZW5kOgogIHBsdWdpbnM6CiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1naXQtcHJvdmlkZXJzLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1hcHAtYWNjZWxlcmF0b3ItYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWNhdGFsb2ctdGVzdC1lbnRpdHktcHJvdmlkZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1jYXRhbG9nLXRlc3QtZW50aXR5LXByb2Nlc3NvcicKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWdpdGxhYi1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tZ2l0aHViLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1naXRodWItYXV0aC1yZXNvbHZlcicKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWt1YmVybmV0ZXMtYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWt1YmVybmV0ZXMtY3VzdG9tLWFwaXMtYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWF6dXJlLWF1dGgtYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWF6dXJlLWF1dGgtcmVzb2x2ZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1naXRsYWItYXV0aC1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tZ2l0bGFiLWF1dGgtcmVzb2x2ZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1nb29nbGUtYXV0aC1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tZ29vZ2xlLWF1dGgtcmVzb2x2ZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1hdXRoMC1hdXRoLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1hdXRoMC1hdXRoLXJlc29sdmVyJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tb2t0YS1hdXRoLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1va3RhLWF1dGgtcmVzb2x2ZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1vbmVsb2dpbi1hdXRoLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1vbmVsb2dpbi1hdXRoLXJlc29sdmVyJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tb2lkYy1hdXRoLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1vaWRjLWF1dGgtcmVzb2x2ZXInCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1naXRodWItYXV0aC1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tYml0YnVja2V0LWF1dGgtYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWF6dXJlLWRldm9wcy1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tbGRhcC1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tbGRhcC10ZXN0LXRyYW5zZm9ybWVycycKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLW1pY3Jvc29mdC1ncmFwaC1vcmctcmVhZGVyLXByb2Nlc3NvcicKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLW1pY3Jvc29mdC1ncmFwaC1vcmctcmVhZGVyLXByb2Nlc3Nvci10ZXN0LXRyYW5zZm9ybWVycycKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWF3cy1zMy1kaXNjb3ZlcnktcHJvY2Vzc29yJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tcGVybWlzc2lvbi1iYWNrZW5kJwogICAgLSBuYW1lOiAnQHRwYi9wbHVnaW4tcGVybWlzc2lvbi10ZXN0LWF1dGgtYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLXZtd2FyZS1jbG91ZC1zZXJ2aWNlcy1hdXRoLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1wZW5kby1hbmFseXRpY3MtYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvcGx1Z2luLWJhY2tzdGFnZS11c2VyLXNldHRpbmdzLWJhY2tlbmQnCiAgICAtIG5hbWU6ICdAdHBiL3BsdWdpbi1hcGktYXV0by1yZWdpc3RyYXRpb24tYmFja2VuZCcKICAgIC0gbmFtZTogJ0B0cGIvdHBiLWN1c3RvbS1sb2dnZXInCg==
      - name: TPB_APP_CONFIG
        value: /tmp/app-config.yaml
      - name: APP_CONFIG_STRING
        value: YXBwOgogIHRpdGxlOiBUUEIgRGV2IEluc3RhbmNlCiAgYmFzZVVybDogaHR0cDovL2xvY2FsaG9zdDozMDAwCgpvcmdhbml6YXRpb246CiAgbmFtZTogVk13YXJlCgpiYWNrZW5kOgogICMhIFVzZWQgZm9yIGVuYWJsaW5nIGF1dGhlbnRpY2F0aW9uLCBzZWNyZXQgaXMgc2hhcmVkIGJ5IGFsbCBiYWNrZW5kIHBsdWdpbnMKICAjISBTZWUgaHR0cHM6Ly9iYWNrc3RhZ2UuaW8vZG9jcy90dXRvcmlhbHMvYmFja2VuZC10by1iYWNrZW5kLWF1dGggZm9yCiAgIyEgaW5mb3JtYXRpb24gb24gdGhlIGZvcm1hdAogICMhIGF1dGg6CiAgIyEgICBrZXlzOgogICMhICAgICAtIHNlY3JldDogJHtCQUNLRU5EX1NFQ1JFVH0KICBiYXNlVXJsOiBodHRwOi8vbG9jYWxob3N0OjcwMDcKICBsaXN0ZW46CiAgICBwb3J0OiA3MDA3CiAgICAjISBVbmNvbW1lbnQgdGhlIGZvbGxvd2luZyBob3N0IGRpcmVjdGl2ZSB0byBiaW5kIHRvIGFsbCBJUHY0IGludGVyZmFjZXMgYW5kCiAgICAjISBub3QganVzdCB0aGUgYmFzZVVybCBob3N0bmFtZS4KICAgICMhIGhvc3Q6IDAuMC4wLjAKICBjc3A6CiAgICBjb25uZWN0LXNyYzogWyInc2VsZiciLCAnaHR0cDonLCAnaHR0cHM6J10KICAgIHVwZ3JhZGUtaW5zZWN1cmUtcmVxdWVzdHM6IGZhbHNlCiAgICAjISBDb250ZW50LVNlY3VyaXR5LVBvbGljeSBkaXJlY3RpdmVzIGZvbGxvdyB0aGUgSGVsbWV0IGZvcm1hdDogaHR0cHM6Ly9oZWxtZXRqcy5naXRodWIuaW8vI3JlZmVyZW5jZQogICAgIyEgRGVmYXVsdCBIZWxtZXQgQ29udGVudC1TZWN1cml0eS1Qb2xpY3kgdmFsdWVzIGNhbiBiZSByZW1vdmVkIGJ5IHNldHRpbmcgdGhlIGtleSB0byBmYWxzZQogIGNvcnM6CiAgICBvcmlnaW46IGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMAogICAgbWV0aG9kczogW0dFVCwgUE9TVCwgUFVULCBERUxFVEVdCiAgICBjcmVkZW50aWFsczogdHJ1ZQogICMhIFRoaXMgaXMgZm9yIGxvY2FsIGRldmVsb3BlbWVudCBvbmx5LCBpdCBpcyBub3QgcmVjb21tZW5kZWQgdG8gdXNlIHRoaXMgaW4gcHJvZHVjdGlvbgogICMhIFRoZSBwcm9kdWN0aW9uIGRhdGFiYXNlIGNvbmZpZ3VyYXRpb24gaXMgc3RvcmVkIGluIGFwcC1jb25maWcucHJvZHVjdGlvbi55YW1sCiAgZGF0YWJhc2U6CiAgICBjbGllbnQ6IGJldHRlci1zcWxpdGUzCiAgICBjb25uZWN0aW9uOiAnOm1lbW9yeTonCiAgY2FjaGU6CiAgICBzdG9yZTogbWVtb3J5CiAgIyEgd29ya2luZ0RpcmVjdG9yeTogL3RtcCAjIFVzZSB0aGlzIHRvIGNvbmZpZ3VyZSBhIHdvcmtpbmcgZGlyZWN0b3J5IGZvciB0aGUgc2NhZmZvbGRlciwgZGVmYXVsdHMgdG8gdGhlIE9TIHRlbXAtZGlyCiAgYXV0aDoKICAgIGtleXM6CiAgICAgIC0gc2VjcmV0OiBkZWZhdWx0LWJhY2tlbmQtc2VjcmV0CgojaW50ZWdyYXRpb25zOgojZ2l0aHViOgojLSBob3N0OiBnaXRodWIuY29tCiMhIFRoaXMgaXMgYSBQZXJzb25hbCBBY2Nlc3MgVG9rZW4gb3IgUEFUIGZyb20gR2l0SHViLiBZb3UgY2FuIGZpbmQgb3V0IGhvdyB0byBnZW5lcmF0ZSB0aGlzIHRva2VuLCBhbmQgbW9yZSBpbmZvcm1hdGlvbgojISBhYm91dCBzZXR0aW5nIHVwIHRoZSBHaXRIdWIgaW50ZWdyYXRpb24gaGVyZTogaHR0cHM6Ly9iYWNrc3RhZ2UuaW8vZG9jcy9nZXR0aW5nLXN0YXJ0ZWQvY29uZmlndXJhdGlvbiNzZXR0aW5nLXVwLWEtZ2l0aHViLWludGVncmF0aW9uCiN0b2tlbjogJHtHSVRIVUJfVE9LRU59CiMhIyBFeGFtcGxlIGZvciBob3cgdG8gYWRkIHlvdXIgR2l0SHViIEVudGVycHJpc2UgaW5zdGFuY2UgdXNpbmcgdGhlIEFQSToKIyEgLSBob3N0OiBnaGUuZXhhbXBsZS5uZXQKIyEgICBhcGlCYXNlVXJsOiBodHRwczovL2doZS5leGFtcGxlLm5ldC9hcGkvdjMKIyEgICB0b2tlbjogJHtHSEVfVE9LRU59Cgpwcm94eToKICAnL3Rlc3QnOgogICAgdGFyZ2V0OiAnaHR0cHM6Ly9leGFtcGxlLmNvbScKICAgIGNoYW5nZU9yaWdpbjogdHJ1ZQoKIyEgUmVmZXJlbmNlIGRvY3VtZW50YXRpb24gaHR0cDovL2JhY2tzdGFnZS5pby9kb2NzL2ZlYXR1cmVzL3RlY2hkb2NzL2NvbmZpZ3VyYXRpb24KIyEgTm90ZTogQWZ0ZXIgZXhwZXJpbWVudGluZyB3aXRoIGJhc2ljIHNldHVwLCB1c2UgQ0kvQ0QgdG8gZ2VuZXJhdGUgZG9jcwojISBhbmQgYW4gZXh0ZXJuYWwgY2xvdWQgc3RvcmFnZSB3aGVuIGRlcGxveWluZyBUZWNoRG9jcyBmb3IgcHJvZHVjdGlvbiB1c2UtY2FzZS4KIyEgaHR0cHM6Ly9iYWNrc3RhZ2UuaW8vZG9jcy9mZWF0dXJlcy90ZWNoZG9jcy9ob3ctdG8tZ3VpZGVzI2hvdy10by1taWdyYXRlLWZyb20tdGVjaGRvY3MtYmFzaWMtdG8tcmVjb21tZW5kZWQtZGVwbG95bWVudC1hcHByb2FjaAp0ZWNoZG9jczoKICBidWlsZGVyOiAnbG9jYWwnICMhIEFsdGVybmF0aXZlcyAtICdleHRlcm5hbCcKICBnZW5lcmF0b3I6CiAgICBydW5JbjogJ2RvY2tlcicgIyEgQWx0ZXJuYXRpdmVzIC0gJ2xvY2FsJwogIHB1Ymxpc2hlcjoKICAgIHR5cGU6ICdsb2NhbCcgIyEgQWx0ZXJuYXRpdmVzIC0gJ2dvb2dsZUdjcycgb3IgJ2F3c1MzJy4gUmVhZCBkb2N1bWVudGF0aW9uIGZvciB1c2luZyBhbHRlcm5hdGl2ZXMuCiAgICBsb2NhbDoKICAgICAgIyEgKE9wdGlvbmFsKS4gU2V0IHRoaXMgdG8gc3BlY2lmeSB3aGVyZSB0aGUgZ2VuZXJhdGVkIGRvY3VtZW50YXRpb24gaXMgc3RvcmVkLgogICAgICBwdWJsaXNoRGlyZWN0b3J5OiAnLi4vLi4vdGVjaGRvY3MvZ2VuZXJhdGVkX3N0YXRpY19odG1sJwoKYXV0aDoKICAjISBzZWUgaHR0cHM6Ly9iYWNrc3RhZ2UuaW8vZG9jcy9hdXRoLyB0byBsZWFybiBhYm91dCBhdXRoIHByb3ZpZGVycwogIGFsbG93R3Vlc3RBY2Nlc3M6IHRydWUKICBwcm92aWRlcnM6IHt9CgpzY2FmZm9sZGVyOgojISBzZWUgaHR0cHM6Ly9iYWNrc3RhZ2UuaW8vZG9jcy9mZWF0dXJlcy9zb2Z0d2FyZS10ZW1wbGF0ZXMvY29uZmlndXJhdGlvbiBmb3Igc29mdHdhcmUgdGVtcGxhdGUgb3B0aW9ucwoKY2F0YWxvZzoKICBydWxlczoKICAgIC0gYWxsb3c6IFtDb21wb25lbnQsIFN5c3RlbSwgQVBJLCBSZXNvdXJjZSwgTG9jYXRpb25dCgprdWJlcm5ldGVzOgogIGN1c3RvbVJlc291cmNlczoKICAgIC0gZ3JvdXA6ICdzZXJ2aW5nLmtuYXRpdmUuZGV2JwogICAgICBhcGlWZXJzaW9uOiAndjEnCiAgICAgIHBsdXJhbDogJ2NvbmZpZ3VyYXRpb25zJwogICAgLSBncm91cDogJ3NlcnZpbmcua25hdGl2ZS5kZXYnCiAgICAgIGFwaVZlcnNpb246ICd2MScKICAgICAgcGx1cmFsOiAncmV2aXNpb25zJwogICAgLSBncm91cDogJ3NlcnZpbmcua25hdGl2ZS5kZXYnCiAgICAgIGFwaVZlcnNpb246ICd2MScKICAgICAgcGx1cmFsOiAncm91dGVzJwogICAgLSBncm91cDogJ3NlcnZpbmcua25hdGl2ZS5kZXYnCiAgICAgIGFwaVZlcnNpb246ICd2MScKICAgICAgcGx1cmFsOiAnc2VydmljZXMnCiAgc2VydmljZUxvY2F0b3JNZXRob2Q6CiAgICB0eXBlOiAnbXVsdGlUZW5hbnQnCiAgY2x1c3RlckxvY2F0b3JNZXRob2RzOiBbXQo=
  params:
    - name: testing_pipeline_matching_labels
      value:
        apps.tanzu.vmware.com/pipeline: noop-pipeline
    - name: testing_pipeline_params
      value: {}
  source:
    image: mstergianis.azurecr.io/tpb:latest
    subPath: builder
```

That workload has certain configuration values put into it. You can customize them as you see fit by modifying them and base64 encoding them and reapplying the workload.

Here is the tpb-config used in the example:

```yaml
app:
  plugins:
    - name: '@tpb/plugin-rrv'
    - name: '@tpb/plugin-app-live-view'
    - name: '@tpb/plugin-azure-auth'
    - name: '@tpb/plugin-gitlab-auth'
    - name: '@tpb/plugin-google-auth'
    - name: '@tpb/plugin-auth0-auth'
    - name: '@tpb/plugin-okta-auth'
    - name: '@tpb/plugin-bitbucket-auth'
    - name: '@tpb/plugin-onelogin-auth'
    - name: '@tpb/plugin-oidc-auth'
    - name: '@tpb/plugin-github-auth'
    - name: '@tpb/plugin-guest-auth'
    - name: '@tpb/plugin-gitlab-loblaw'
    - name: '@tpb/plugin-api-scoring'
    - name: '@tpb/plugin-app-accelerator-scaffolder'
    - name: '@tpb/plugin-pendo-analytics'
    - name: '@tpb/plugin-security-analysis-frontend'
    - name: '@tpb/plugin-supply-chain'
    - name: '@tpb/plugin-vmware-cloud-services-auth'
backend:
  plugins:
    - name: '@tpb/plugin-git-providers-backend'
    - name: '@tpb/plugin-app-accelerator-backend'
    - name: '@tpb/plugin-catalog-test-entity-provider'
    - name: '@tpb/plugin-catalog-test-entity-processor'
    - name: '@tpb/plugin-gitlab-backend'
    - name: '@tpb/plugin-github-backend'
    - name: '@tpb/plugin-github-auth-resolver'
    - name: '@tpb/plugin-kubernetes-backend'
    - name: '@tpb/plugin-kubernetes-custom-apis-backend'
    - name: '@tpb/plugin-azure-auth-backend'
    - name: '@tpb/plugin-azure-auth-resolver'
    - name: '@tpb/plugin-gitlab-auth-backend'
    - name: '@tpb/plugin-gitlab-auth-resolver'
    - name: '@tpb/plugin-google-auth-backend'
    - name: '@tpb/plugin-google-auth-resolver'
    - name: '@tpb/plugin-auth0-auth-backend'
    - name: '@tpb/plugin-auth0-auth-resolver'
    - name: '@tpb/plugin-okta-auth-backend'
    - name: '@tpb/plugin-okta-auth-resolver'
    - name: '@tpb/plugin-onelogin-auth-backend'
    - name: '@tpb/plugin-onelogin-auth-resolver'
    - name: '@tpb/plugin-oidc-auth-backend'
    - name: '@tpb/plugin-oidc-auth-resolver'
    - name: '@tpb/plugin-github-auth-backend'
    - name: '@tpb/plugin-bitbucket-auth-backend'
    - name: '@tpb/plugin-azure-devops-backend'
    - name: '@tpb/plugin-ldap-backend'
    - name: '@tpb/plugin-ldap-test-transformers'
    - name: '@tpb/plugin-microsoft-graph-org-reader-processor'
    - name: '@tpb/plugin-microsoft-graph-org-reader-processor-test-transformers'
    - name: '@tpb/plugin-aws-s3-discovery-processor'
    - name: '@tpb/plugin-permission-backend'
    - name: '@tpb/plugin-permission-test-auth-backend'
    - name: '@tpb/plugin-vmware-cloud-services-auth-backend'
    - name: '@tpb/plugin-pendo-analytics-backend'
    - name: '@tpb/plugin-backstage-user-settings-backend'
    - name: '@tpb/plugin-api-auto-registration-backend'
    - name: '@tpb/tpb-custom-logger'
```

which could be fetched with:

```shell
$ yq <workload.yaml '.spec.build.env[] | select(.name == "TPB_CONFIG_STRING").value' -r | base64 -d > workload-tpb-config.yaml
```

after your modifications you can re-encode that file and put it into your workload.yaml

```shell
$ base64 <workload-tpb-config.yaml -w0
```

The same process applies to app-config and will not be covered for brevity.

# Watching progress through the supply chain

From there you can watch it go through the supply chain. This should be
available in the TAP GUI on your cluster, which you can find the URL to with

```shell
$ kubectl -n tap-gui get httpproxy tap-gui -o jsonpath={.spec.virtualhost.fqdn}
```

visit that url in your browser and navigate to the supply chains plugin and find your workload!

# Troubleshooting when things don't work

Unfortunately mstergianis isn't an expert on supply chains and is having trouble
writing this session. Feel free to yell at him if you encounter issues, but you
may have to reach out in
[tap-assist](https://vmware.slack.com/archives/C02D60T1ZDJ) for generic TAP
inquiries, and
[dev-portal-assist](https://vmware.slack.com/archives/C028W549JHX) for builder
related inquiries, if you're experiencing issues.
