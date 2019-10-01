# k8ss

> k8s cluster and namespace switcher

[![Git commit with emojis!](https://img.shields.io/badge/gitmoji-git%20commit%20with%20emojis!-red.svg)](https://gitmoji.js.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Prerequisites

- `kubectl` installed
- `k8s-config` folder in home directory, for example:

```pre
~
 |-- k8s-config
       |-- hangzhou
              |-- config
       |-- beijing
              |-- config
```

## Installation

```shell
npm install k8ss --global
```

## Usage

```shell
k8ss switch --cluster=hangzhou --namespace=test
```

## How

- move the related `config` file into `~/.kube`
- execute `kubectl config set-context $(kubectl config current-context) --namespace=<namespace>`
