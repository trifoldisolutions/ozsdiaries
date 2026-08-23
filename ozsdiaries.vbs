Set WshShell = CreateObject("WScript.Shell")
projectPath = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\") - 1)
WshShell.Run "cmd /c code --new-window """ & projectPath & """", 0, False
