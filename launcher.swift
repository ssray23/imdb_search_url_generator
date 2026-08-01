import Foundation
import Cocoa

let projectDir = "/Users/suddharay/Library/Mobile Documents/com~apple~CloudDocs/Mac Projects/IMDB Search URL Generator"
let targetPort = 5173
let targetUrlString = "http://127.0.0.1:\(targetPort)"

// Helper to find npm path across standard macOS install locations
func findNpmPath() -> String {
    let candidatePaths = [
        "/opt/homebrew/bin/npm",
        "/usr/local/bin/npm",
        "/usr/bin/npm",
        "/bin/npm"
    ]
    for path in candidatePaths {
        if FileManager.default.fileExists(atPath: path) {
            return path
        }
    }
    return "npm"
}

// Check if port 5173 is active
func isPortActive() -> Bool {
    let task = Process()
    task.executableURL = URL(fileURLWithPath: "/usr/bin/lsof")
    task.arguments = ["-i", ":\(targetPort)"]
    let pipe = Pipe()
    task.standardOutput = pipe
    task.standardError = pipe
    do {
        try task.run()
        task.waitUntilExit()
        return task.terminationStatus == 0
    } catch {
        return false
    }
}

// Open URL in system default browser using macOS 'open' binary
func openInDefaultBrowser(url: String) {
    let task = Process()
    task.executableURL = URL(fileURLWithPath: "/usr/bin/open")
    task.arguments = [url]
    do {
        try task.run()
        task.waitUntilExit()
    } catch {
        if let u = URL(string: url) {
            NSWorkspace.shared.open(u)
        }
    }
}

// Start Vite server if port 5173 is not active
if !isPortActive() {
    let npmPath = findNpmPath()
    let task = Process()
    task.executableURL = URL(fileURLWithPath: npmPath)
    task.arguments = ["run", "dev"]
    task.currentDirectoryURL = URL(fileURLWithPath: projectDir)
    
    // Set PATH environment variable so node and npm can be found by GUI app
    var env = ProcessInfo.processInfo.environment
    let extraPath = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    env["PATH"] = "\(extraPath):\(env["PATH"] ?? "")"
    task.environment = env

    do {
        try task.run()
    } catch {
        print("Failed to start server: \(error)")
    }
    
    // Poll up to 6 seconds for port 5173 to become ready
    var attempts = 0
    while !isPortActive() && attempts < 60 {
        Thread.sleep(forTimeInterval: 0.1)
        attempts += 1
    }
}

// Open web application in browser tab
openInDefaultBrowser(url: targetUrlString)
