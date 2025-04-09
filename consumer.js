const Redis = require("ioredis")
const fs = require("fs")
const { redisStreamKey, numberRange, jsonOutputPath } = require("./config")

const redis = new Redis()
const seenNumbers = new Set()
const results = []
const startTime = Date.now()

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
		if (!stream) continue

		const [_, entries] = stream[0]

		for (const [id, data] of entries) {
			lastId = id

			const idx = data.findIndex(x => x === "number")
			if (idx === -1) continue

			const number = parseInt(data[idx + 1], 10)
			if (!seenNumbers.has(number)) {
				seenNumbers.add(number)
				results.push({ number, generatedAt: new Date().toISOString() })

				if (seenNumbers.size > numberRange) break
			}
		}
	}

	const timeSpent = Date.now() - startTime
	const output = {
		timeSpent,
		numbersGenerated: results.map(r => r.number),
	}

	fs.writeFileSync(jsonOutputPath, JSON.stringify(output, null, 2))
	console.log(
		`✅ Завершено за ${timeSpent} мс. Результат збережено в ${jsonOutputPath}`
	)
	process.exit(0)
}

consume()
