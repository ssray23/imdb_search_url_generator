import Foundation
import Cocoa

let projectDir = "/Users/suddharay/Library/Mobile Documents/com~apple~CloudDocs/Mac Projects/IMDB Search URL Generator"
let targetPort = 5173
let targetUrlString = "http://localhost:\(targetPort)"

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

// Check if default browser is currently running
func isDefaultBrowserRunning() -> Bool {
    guard let defaultBrowserURL = NSWorkspace.shared.urlForApplication(toOpen: URL(string: "http://localhost")!) else {
        return false
    }
    let runningApps = NSWorkspace.shared.runningApplications
    return runningApps.contains { app in
        app.bundleURL == defaultBrowserURL
    }
}

let browserWasAlreadyRunning = isDefaultBrowserRunning()

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

if let url = URL(string: targetUrlString) {
    // Open URL in default browser in a new tab
    NSWorkspace.shared.open(url)
    
    // Cold launch check
    if !browserWasAlreadyRunning {
        Thread.sleep(forTimeInterval: 1.2)
        NSWorkspace.shared.open(url)
    }
}
