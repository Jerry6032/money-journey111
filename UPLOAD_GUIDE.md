# 为什么不能直接上传？要怎么传？(Q&A)

## Q1: 你说“不能直接上传这个文件夹”，是什么意思？
我的意思是：**不要直接把这个文件夹拖到 GitHub 的网页上去**。
因为：
1.  网页版上传能力很弱，处理不了成千上万个文件。
2.  这个文件夹里含有一个叫 `node_modules` 的子文件夹，里面有 **几万个** 系统自动生成的小文件（垃圾文件），如果强行传，浏览器会卡死。

## Q2: 那我怎么把项目传上去？难道要一个一个文件传？
**绝对不需要！** 只要用对工具，是一键上传的。

我们需要用一个叫 **GitHub Desktop** 的软件（它是 GitHub 官方出的“搬家机器人”）。

### 这个机器人的工作原理：
1.  你把整个文件夹 (`money-journey-(钱程)`) 指给它看。
2.  它会自动读取我写好的“黑名单” (`.gitignore` 文件)。
3.  它会自动把 `node_modules` 这种垃圾文件剔除出去。
4.  它会把剩下的所有有用代码（几百个文件）打包，**一次性** 上传到 GitHub。

## Q3: 只要三步，傻瓜式操作：

1.  **下载软件**: 安装 [GitHub Desktop](https://desktop.github.com/) 并登录。
2.  **添加文件夹**: 
    - 菜单栏点 `File` -> `Add local repository...`
    - 选择 `d:\Users\WJY\Downloads\money-journey-(钱程)` 这个路径。
    - (如果弹窗提示 "This directory does not appear to be a Git repository"，点蓝色的 **Create a repository**，然后直接点右下角 Create 即可)。
3.  **点击发布**:
    - 点击右上角的 **Publish repository** 按钮。
    - 只有这一步才是真正的上传，点完之后，你的所有代码就都在 GitHub 上了！
