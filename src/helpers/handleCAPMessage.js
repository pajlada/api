// Local imports
import CAPABILITIES from 'data/CAPABILITIES'





// Local constants
const { HOST } = process.env





export default (message, connection) => {
	const {
		addCapabilities,
		send,
		sendMOTD,
		sendUnknownCommand,
	} = connection
	const [subcommand, args] = message.params
	const splitArgs = args.split(' ')

	switch (subcommand) {
		case 'END':
			connection.capabilitiesFinished = true
			connection.emit('acknowledge')
			break

		case 'LIST':
		case 'LS':
			send(`:${HOST} CAP * ${subcommand} ${CAPABILITIES.join(' ')}`)
			break

		case 'REQ':
			addCapabilities(splitArgs)
			connection.capabilitiesFinished = true
			connection.emit('acknowledge')
			send(`:${HOST} CAP * ACK ${connection.capabilities.filter(capability => CAPABILITIES.includes(capability)).join(' ')}`)
			break

		default:
			sendUnknownCommand(`CAP ${subcommand}`)
	}
}
