/**
 * Shinsengumi is a discord bot offering general utilities and server moderation tools
 * Copyright (C) 2020 Yi Fan Song <yfsong00@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 **/

import { BitFieldResolvable, Message, Permissions, PermissionString } from 'discord.js';

import { BotClient } from '../BotClient';
import { replyToCommand } from '../utils/messageUtils';
import { extractChannelId, splitArguments } from '../utils/stringUtils';

export const permissions: BitFieldResolvable<PermissionString> = Permissions.FLAGS.ADMINISTRATOR;

/**
 * 
 */
export default (msg: Message, client: BotClient) => {

	let target: string;
	const args = splitArguments(msg.content);

	if (args.length === 0 || args[0] == 'here') {
		target = msg.channel.id;
	} else {
		target = extractChannelId(args[0]);
	}

	client.databaseClient.addCommandChannel(msg.guild.id, target)
		.then(n => {
			switch(n) {
				case 0: {
					replyToCommand(msg, 'The channel has been added to the command channels.');
		
					// Update the commandChannels list
					client.updateCommandChannels();
					break;
				}
				case 1: {
					replyToCommand(msg, 'The target channel is already set as a command channel');
					break;
				}
			}
		})
		.catch(err => {
			client.logger.error(err);
		});
}