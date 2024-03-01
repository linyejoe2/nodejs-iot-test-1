import express from "express";
const app = express();

import { run } from "./DB/mongo";
import { mqtt, iot } from "aws-iot-device-sdk-v2";
import { resolve } from "path";
import { rejects } from "assert";

function build_connection(): mqtt.MqttClientConnection {
	let builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path('./auth/dev_randy_service.cert.pem', "./auth/dev_randy_service.private.key")
	builder.with_endpoint('a36r5zacwfi0i3-ats.iot.ap-northeast-1.amazonaws.com');
	// let builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path('./auth/test_1.cert.pem', "./auth/test_1.private.key")
	// builder.with_endpoint('a3fkcbkhjclj63-ats.iot.ap-northeast-2.amazonaws.com');
	builder.with_clean_session(false);
	builder.with_client_id("sdk-nodejs-v2");
	const config = builder.build();

	const client = new mqtt.MqttClient();

	// connection.subscribe("test-open-1", mqtt.QoS.AtLeastOnce, async (topic, payload) => {
	// 	// 當接收到 MQTT 訊息時，執行對應的處理函數
	// 	console.log(`收到來自主題 ${topic}: ${payload.toString()}`);
	// 	// 在這裡可以執行其他相關操作
	// }).then(() => {
	// 	console.log('Subscribed to topic "test-open-1"');
	// })
	// 	.catch((err) => {
	// 		console.error('Failed to subscribe to topic:', err);
	// 	});
	return client.new_connection(config);
	// const connection = client.new_connection(config);
	// return connection;
}
const connection = build_connection();
connection.connect();
// connection.subscribe("iot/test/*", mqtt.QoS.AtLeastOnce, async (topic, payload) => {
// 	console.log(`收到來自主題 ${topic}: ${Buffer.from(payload).toString()}`);
// })


app.post("/sanding-message", async (req, res) => {
	try {
		let json = `{ "id": "123", "user": "Randy" }`
		await connection.publish("sdk/test/js", json, mqtt.QoS.AtLeastOnce);
		res.send("succfully send message");
	} catch (e) {
		console.log(e);
		res.send("err: " + e)
	}
})

app.post("/insert", (req, res) => {
	run().then(() => res.send("ok"));
})

app.post("/sanding-message-2", async (req, res) => {
	try {
		await connection.connect();
		const message = await connection.subscribe("sdk/test/js", mqtt.QoS.AtLeastOnce, async (topic, payload) => {
			console.log(`收到來自主題 ${topic}: ${payload.toString()}`);
		})
		console.log(message.error_code)

		let json = `{ "id": "123", "user": "Randy" }`
		await connection.publish("sdk/test/js", json, mqtt.QoS.AtLeastOnce);
		res.send("succfully send message");
	} catch (e) {
		console.log(e);
		res.send("err: " + e)
	}
})

app.all('*', (req, res) =>
	res.send('Hello iot')
);

const port = 3001;
app.listen(port, () => { console.log("server listening at https://localhost:" + port) })