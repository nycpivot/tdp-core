import {execSync} from "child_process";
import {Vault} from "./vault";
import fs from "fs"
import {checkIfServerIsReady, sleepUntil} from "./sleepUntil";
import {generateToken} from "./bitbucket-server/generateToken";

async function startContainers() {
  const vaultAddress = process.env.VAULT_ADDR
  if (!vaultAddress) {
    throw new Error("Please define the VAULT_ADDR environment variable.")
  }

  const vaultToken = execSync(`cat ${process.env.HOME}/.vault-token`, {encoding: "utf-8"})

  const vault = Vault.build({
    endpoint: vaultAddress,
    token: vaultToken
  })

  const bitbucketServerLicense = await vault.read("runway_concourse/esback/e2e", "bitbucket_server_license")
  const githubEnterpriseToken = await vault.read("runway_concourse/esback/e2e", "github_enterprise_token")
  const githubToken = await vault.read("runway_concourse/esback/e2e", "github_token")
  const gitlabToken = await vault.read("runway_concourse/esback/gitlab", "core_token")

  const gitBranch = execSync("git rev-parse --abbrev-ref HEAD", {"encoding": "utf-8"})

  const env = {
    ...process.env,
    BITBUCKET_SERVER_LICENSE: bitbucketServerLicense,
    GITHUB_ENTERPRISE_TOKEN: githubEnterpriseToken,
    GITHUB_TOKEN: githubToken,
    GITLAB_TOKEN: gitlabToken,
    GIT_BRANCH: gitBranch,
    BACKSTAGE_BASE_URL: process.env.BACKSTAGE_BASE_URL,
  }

  fs.rmSync(`${process.env.HOME}/.esback-e2e/bitbucket`, {force: true, recursive: true})
  execSync("docker-compose stop", {cwd: `${__dirname}/../..`, env: env})
  execSync("docker-compose rm -fv", {cwd: `${__dirname}/../..`, env: env})
  execSync("docker-compose up -d bitbucket", {
    env: env,
    cwd: `${__dirname}/../..`
  })

  await sleepUntil(bitbucketServerIsReady, 5 * 60 * 1000)
  const token = await generateToken("http://localhost:7990", {
    username: "esback",
    password: "esback"
  })

  process.stdout.write(`Generated token for bitbucket token: ${token}`)

  execSync("docker-compose up -d esback", {
    env: {...env, BITBUCKET_TOKEN: token},
    cwd: `${__dirname}/../..`
  })
}

async function bitbucketServerIsReady(): Promise<boolean> {
  return checkIfServerIsReady(`http://localhost:7990/status`, (response) => response.status === 200 && response.data.state === "RUNNING")
}

startContainers().then(r => process.stdout.write("Containers started\n\n"))

