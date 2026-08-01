import Foundation
import Cocoa

let projectDir = "/Users/suddharay/Library/Mobile Documents/com~apple~CloudDocs/Mac Projects/IMDB Search URL Generator"
let targetPort = 5173
let targetUrlString = "http://localhost:\(targetPort)"

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
    let task = Process()
    task.executableURL = URL(fileURLWithPath: "/usr/bin/env")
    task.arguments = ["npm", "run", "dev"]
    task.currentDirectoryURL = URL(fileURLWithPath: projectDir)
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
    // Open URL in default browser
    NSWorkspace.shared.open(url)
    
    // Cold launch check
    if !browserWasAlreadyRunning {
        Thread.sleep(forTimeInterval: 1.2)
        NSWorkspace.shared.open(url)
    }
}
