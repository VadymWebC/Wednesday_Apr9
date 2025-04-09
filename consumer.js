const Redis = require("ioredis")
const fs = require("fs")
const { redisStreamKey, numberRange, jsonOutputPath } = require("./config")

const redis = new Redis()
const seenNumbers = new Set()

async function consume() {
	let lastId = "0-0"

	while (seenNumbers.size <= numberRange) {
		const stream = await redis.xread(
			"BLOCK",
			0,
			"STREAMS",
			redisStreamKey,
			lastId
		)
	}
}

consume()
