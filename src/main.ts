import * as core from "@actions/core";
import request from "request";

async function main() {
	try {
		const title: string = core.getInput("TITLE", { required: true });
		const author: string = core.getInput("AUTHOR", { required: true });
		const commitDescription: string = core.getInput("COMMIT", { required: true });
		const prLink: string = core.getInput("LINK", { required: true });
		const teamsWebhook: string = core.getInput("MS_TEAMS_WEBHOOK", { required: true });
		sendTeamsNotification(title, author, commitDescription, prLink, teamsWebhook);
	} catch (err) {
		core.error("❌ Failed");
		core.setFailed(err.message);
	}
}


/**
 * Sends a MS Teams notification
 * @param title
 * @param body
 */
async function sendTeamsNotification(title: string, author: string, commitDescription: string, prLink: string,  webhookUrl: string) {
	const data = `{
       "type":"message",
       "attachments":[
          {
             "contentType": "application/vnd.microsoft.card.adaptive",
             "content": {
				"type": "AdaptiveCard",
				"body": [
					{
						"type": "TextBlock",
						"size": "Medium",
						"weight": "Bolder",
						"text": "${title}"
					},
					{
						"type": "ColumnSet",
						"columns": [
							{
								"type": "Column",
								"items": [
									{
										"type": "TextBlock",
										"spacing": "None",
										"text": "${author}",
										"isSubtle": true,
										"wrap": true
									}
								],
								"width": "stretch"
							}
						]
					},
					{
						"type": "TextBlock",
						"text": "${commitDescription}",
						"wrap": true
					}
				],
				"actions": [
					{
						"type": "Action.OpenUrl",
						"title": "View",
						"url": "${prLink}"
					}
				],
				"msteams": {
                    "entities": [
                        {
                            "type": "mention",
                            "text": "<at>Devs</at>",
                            "mentioned": {
                                "id": "tilqeHcVY",
                                "name": "Devs",
                                "type": "tag"
                            }
                        }
                    ]
                },
				"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
				"version": "1.6"
			}
          }
       ]
    }`;
	request(webhookUrl, {
		method: "POST",
		body: data
	})
}

main();
