//
//  ViewController.swift
//  H5ForLocal
//
//  Created by Wl Alili on 2023/7/31.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate {
    
    var webView: WKWebView!
    var loadingIndicator: UIActivityIndicatorView!
    var errorView: UIView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        // 创建 WKWebView 实例
        let webViewConfiguration = WKWebViewConfiguration()
        webViewConfiguration.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        let userContentController = WKUserContentController()
        let preferences = WKPreferences()
        userContentController.add(self, name: "callbackHandler") // 添加交互处理
        webViewConfiguration.userContentController = userContentController
        preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        webViewConfiguration.preferences = preferences
        // 添加本地JS
//        let scriptPath = Bundle.main.path(forResource: "script", ofType: "js")
//        let scriptContent = try! String(contentsOf: URL(fileURLWithPath: scriptPath!))
//        let userScript = WKUserScript(source: scriptContent, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        
        webView = WKWebView(frame: view.bounds, configuration: webViewConfiguration)
        webView.navigationDelegate = self
        view.addSubview(webView)
//        webViewConfiguration.userContentController.addUserScript(userScript)

        
        // 创建 loading 指示器
        loadingIndicator = UIActivityIndicatorView(style: .large)
        loadingIndicator.center = view.center
        loadingIndicator.hidesWhenStopped = true
        view.addSubview(loadingIndicator)
        
        // 加载本地 H5 文件
        if let htmlPath = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "H5") {
            let dirUrl = htmlPath.deletingLastPathComponent()
            webView.loadFileURL(htmlPath, allowingReadAccessTo: dirUrl)
        }
    }
    
    // 创建错误视图
    func createErrorView() -> UIView {
        let errorView = UIView(frame: view.bounds)
        errorView.backgroundColor = .white
        
        let errorLabel = UILabel(frame: CGRect(x: 0, y: 0, width: 200, height: 50))
        errorLabel.center = view.center
        errorLabel.text = "加载失败，请重试"
        errorLabel.textAlignment = .center
        errorView.addSubview(errorLabel)
        
        let retryButton = UIButton(type: .system)
        retryButton.setTitle("重试", for: .normal)
        retryButton.frame = CGRect(x: 0, y: 0, width: 100, height: 50)
        retryButton.center = CGPoint(x: view.center.x, y: view.center.y + 50)
        retryButton.addTarget(self, action: #selector(retryButtonTapped), for: .touchUpInside)
        errorView.addSubview(retryButton)
        
        return errorView
    }
    
    // 重试按钮点击事件
    @objc func retryButtonTapped() {
        // 隐藏错误视图
        errorView.isHidden = true
        
        // 重新加载网页
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html") {
            let url = URL(fileURLWithPath: htmlPath)
            webView.loadFileURL(url, allowingReadAccessTo: url)
        }
    }
    
    // 实现 WKScriptMessageHandler 的代理方法，处理与 JavaScript 的交互
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "callbackHandler" {
            if let body = message.body as? String {
                // 处理从 JavaScript 传递过来的数据
                print("Received data from JavaScript: \(body)")
            }
        }
    }
    
    // WKNavigationDelegate 回调方法：开始加载网页
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("开始加载网页")
        // 在这里可以给出加载开始的提示
        loadingIndicator.startAnimating()
    }
    
    // WKNavigationDelegate 回调方法：网页加载完成
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("网页加载完成")
        // 禁止放大缩小
            let injectionJSString = "var script = document.createElement('meta');"
                + "script.name = 'viewport';"
                + "script.content=\"width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no\";"
                + "document.getElementsByTagName('head')[0].appendChild(script);"
        webView.evaluateJavaScript(injectionJSString, completionHandler: nil)

        // 在这里可以给出加载完成的提示
        loadingIndicator.stopAnimating()
    }
    
    // WKNavigationDelegate 回调方法：网页加载失败
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("网页加载失败：\(error.localizedDescription)")
        // 在这里可以给出加载失败的提示
        loadingIndicator.stopAnimating()
    }
    
}

