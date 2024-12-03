import * as core from "@actions/core";
import request from "request";

async function main() {
	try {
		const title: string = core.getInput("TITLE", { required: true });
		const body: string = core.getInput("BODY", { required: true });
		const teamsWebhook: string = core.getInput("MS_TEAMS_WEBHOOK", { required: true });
		sendTeamsNotification(title, body, teamsWebhook);
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
async function sendTeamsNotification(title: string, body: string, webhookUrl: string) {
	const data = `{
       "type":"message",
       "attachments":[
          {
             "contentType": "application/vnd.microsoft.card.adaptive",
             "content": {
                "type": "AdaptiveCard",
                "version": "1.3",
                "body":[
                    {
						"type": "TextBlock",
						"size": "medium",
						"weight": "bolder",
						"style": "heading",
						"wrap": true,
						"text": "${title}"
                    },
					{
						"type": "TextBlock",
						"text": "${body}",
						"wrap": true
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
                }
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
