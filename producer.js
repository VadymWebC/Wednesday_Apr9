const Redis = require("ioredis")
const { redisStreamKey, numberRange } = require("./config")
const redis = new Redis()

function getRandomInt(max) {
	return Math.floor(Math.random() * (max + 1))
}

async function startProducing() {
	while (true) {
		const num = getRandomInt(numberRange)
		await redis.xadd(redisStreamKey, "*", "number", num.toString())
		await new Promise(resolve => setTimeout(resolve, 1)) // мiкро-затримка для реалістичної поведінки
	}
}

startProducing()
