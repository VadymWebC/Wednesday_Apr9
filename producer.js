const Redis = require("ioredis")
const { redisStreamKey, numberRange } = require("./config")

async function startProducing() {
	while (true) {
		const num = Math.floor(Math.random() * (max + 1))
		await redis.xadd(redisStreamKey, "*", "number", num.toString())
	}
}

startProducing()
