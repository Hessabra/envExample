const vscode = require('vscode');
const fs = require('fs');


const RemoveWhiteSpaces = (string) => {
	return string.split(' ').join('')
}

const GetVariables = (string) => {
	let initialArray = RemoveWhiteSpaces(string).split('\n')
	let finalArray = initialArray.map( element => element.split('=')[0]+'=' )
	finalArray = finalArray.filter( element => element !== "=" )
	return finalArray.join("\n")
}

const UpdateEnvExample = (pwd, e) => {
	let ValueTextEditor = e.document.getText()
	fs.writeFile(pwd.join('/')+ '/.env.example', GetVariables(ValueTextEditor), (err) => {
		if (err) return console.error(err);
		console.log('Update .env.example');
	})
}

function activate() {
	vscode.commands.registerCommand('extension.envExample', () => {
		let pwd = vscode.window.activeTextEditor.document.fileName.split('/')
		if (pwd.slice(-1)[0] === ".env" ) {
			pwd.pop()
			UpdateEnvExample(pwd, vscode.window.activeTextEditor)
			vscode.window.showInformationMessage('\`.env.example\` was created/updated');
		} else
			vscode.window.showInformationMessage('Open \`.env\` file first');
	});

	let pwd = vscode.window.activeTextEditor.document.fileName.split('/')

	if (pwd.slice(-1)[0] === ".env") {
		pwd.pop()
		UpdateEnvExample(pwd, vscode.window.activeTextEditor)
		vscode.workspace.onWillSaveTextDocument((e) => UpdateEnvExample(pwd, e))
	}
	
	vscode.window.onDidChangeActiveTextEditor((textEditor) => {
		let pwd = textEditor.document.fileName.split('/')
		if (textEditor && pwd.slice(-1)[0] === ".env") {
			pwd.pop()
			UpdateEnvExample(pwd, vscode.window.activeTextEditor)
			vscode.workspace.onWillSaveTextDocument((e) => UpdateEnvExample(pwd, e))
		}
	});

	
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
