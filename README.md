# 服务宝 - 体验平台

## 开发

### 基本依赖

```
node >= 0.12
```

### 代码规范

https://github.com/airbnb/javascript

### 运行

```
npm install -g tnpm --registry=http://registry.npm.alibaba-inc.com
tnpm install
npm run dev
```
### 流程

```
git checkout daily/20150930
git checkout -b 你的分支名
```

... 编写代码

```
git add --all
git commit -am "提交信息"
git push origin 你的分支名:你的分支名
```
到 gitlab 页面发 merge request 到分支 daily/20150930.

合并后重复流程

### 构建

```
npm run build
```
