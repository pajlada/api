// Module imports
import mri from 'mri'





// Local imports
import renderCommandResponse from 'helpers/renderCommandResponse'
import User from 'structures/User'





// Local constants
const { HOST } = process.env





export default (messageData, connection) => {
	const {
		getChannel,
		getUser,
		send,
	} = connection
	const [channelName, message] = messageData.params

	const argv = message
		.replace(/"(.*?)"|'(.*?)'/g, (match, singleQuotes, doubleQuotes) => {
			return (singleQuotes || doubleQuotes).replace(/\s/g, '\\s')
		})
		.split(' ')
		.map(item => item.replace(/\\s/g, ' '))

	const channel = getChannel(channelName)
	const {
		_: [
			command,
			...messageBody
		],
		...args
	} = mri(argv)

	args.message = messageBody.join(' ')

	const username = args.username || connection.username

	let user = getUser(username)

	if (!user) {
		user = new User({
			connection,
			username,
		})
	}

	const response = renderCommandResponse({
		args,
		channel,
		command,
		connection,
		user,
	})

	if (response) {
		send(response)
	} else {
		channel.sendErrorMessage(`FDGT doesn't support the "${command}" command.`)
	}
}
