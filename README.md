## k8ss

> k8s cluster and namespace switcher

# Prerequisites:

- `kubectl` installed
- `k8s-config` folder in home directory, for example:

```
~
 |-- k8s-config
       |-- hangzhou
              |-- config
       |-- beijing
              |-- config
```

# Installation:
```shell
npm install k8ss --global
```

# Usage:

```shell
k8ss switch --cluster=hangzhou --namespace=test
```

# How?
- move the related `config` file into `~/.kube`
- execute `kubectl config set-context $(kubectl config current-context) --namespace=<namespace>`
