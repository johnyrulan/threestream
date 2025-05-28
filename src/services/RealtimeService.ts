import ToastHelper from "@/helpers/ToastHelper";
import eventBus from '@/events/EventBus';
import { Channel, StreamChat } from "stream-chat";
import { RestApi } from "./RestApi";
import ErrorLogger from "@/helpers/ErrorLogger";
import User from "@/models/User";
import StringHelper from "@/helpers/StringHelper";

export default class RealtimeService {
    static client = StreamChat.getInstance(import.meta.env.VITE_GETSTREAM_KEY as string);
    static channel: Channel;

    static async initializeRealtimeService(user: User, groupId: string, groupName: string, token: string, hostId: string) {
        try {
            // await RealtimeService.logout();

            await RealtimeService.createUser(user, token);
            await RealtimeService.createGroup(groupId, groupName, hostId);

            if (user.id !== 'guest') {
                await RealtimeService.addUserToGroup(user.id, groupId);
            } 
            
            // ToastHelper.success('Connected to stream')

            eventBus.emit('onRealtimeServiceConnected', {});
        } catch (err) {
            ToastHelper.error('There was an error connecting to the chat')
        }
    }

    static async initializeChat(user: User, token: string) {
        try {
            await RealtimeService.createUser(user, token);
            eventBus.emit('onRealtimeServiceConnected', {});
        } catch (err) {
            ToastHelper.error('There was an error connecting to chat')
        }
    }

    static async createChatGroup(members: string[]) {
        try {
            this.channel = this.client.channel('messaging', null, {
                members: members
            })

            return await this.channel.create()
        } catch (err) {            
            ToastHelper.error('That user is not currently available to start a thread')
        }
    }

    static async createGroup (groupId: string, groupName: string, hostId: string) {
              
        try {
            // TODO: Why do we need server?
            // await RestApi.Livestream.createChannel(groupId, hostId);

            this.channel = this.client.channel('livestream', groupId, {
                name: groupName
            })

            // this.channel = this.client.getChannelById('livestream', groupId, {
            //     name: groupName
            // });
            
        } catch (e: any) {
            ToastHelper.error('There was an error creating the channel')
            console.log(e)
        }
    }

   static async createUser (user: User, token: string) {        
        const chatUser =   {
            id: user.id,
            name: user.name,
            image: user.userAttributes?.profilePicUrl        
        }; 

        try {
            if (user.id === 'guest') {
                return await this.client.connectAnonymousUser();
            }
            else if (!this.client.user) {                
                return await this.client.connectUser(chatUser, token);                
            }            
        } catch (e: any) {
            console.log(e)
        }
    }

    static async logout () {
        try {
            this.channel.clean()
            await this.client.disconnectUser();
        } catch (e) {
            console.log(e)
        }
    }

    static async addUserToGroup (userId: string, channelId: string) {
        try {
            // TODO: Why do we need this?
            // await RestApi.Livestream.addChannelMember(channelId, userId);
            
            await RestApi.Livestream.addUserToRealtimeService(channelId);
        } catch (e) {
            console.log(e)
        }
    }

    static async getGroupConversation () {
        try {
            return (await this.channel.watch()).messages;            
        } catch (e) {
            console.log(e)
        }
    }

    static async sendMessage (message: string) {
        try {
            await this.channel.sendMessage({
                message                
            });
        } catch (e) {
           console.log(e)
        }
    }

    static async getUnreadMessageCount(user: User) {        
        try {
            if (!this.client.user) {
                const token = (await RestApi.Livestream.getUserChatToken()).data;    
    
                const currUser = await this.createUser(user, token);            

                if (currUser) {
                    return currUser.me.total_unread_count;
                } 
            }

            else {
                return this.client.user.total_unread_count as number;
            }            
        } catch (err) {
            await ErrorLogger.logApiError(err)
        }

        return 0;
    }

    static async startTyping() {
        try {
            await this.channel.keystroke()
        } catch (err) {            
            await ErrorLogger.logApiError(err)
        }
    }

    static async stopTyping() {
        try {
            await this.channel.stopTyping()
        } catch (err) {
            await ErrorLogger.logApiError(err)
        }
    }

    static async getAllGroupMembers() {
        try {
            return (await this.channel.queryMembers({}, {}, {})).members.map(x => x.user);
        } catch (e) {
            console.log(e)
        }
    }

    static async markChannelAsRead() {
        try {
            await this.channel?.markRead();
        } catch (err) {
            await ErrorLogger.logApiError(err)
        }
    }

    static async setChannel(channelId: string) {
        try {
            const filter = { type: 'messaging', id: { $eq: channelId } };

            const channels = await this.client.queryChannels(filter)
            
            if (channels.length > 0) {
                this.channel = channels[0]
            }

            await this.markChannelAsRead();
        } catch(err) {            
            await ErrorLogger.logApiError(err)
        }
    }

    static async getUserChannels(userId: string) {
        try {
            const filter = { type: 'messaging', members: { $in: [userId] } };
            const sort = [{ last_message_at: -1 }];
            
            const channels = await this.client.queryChannels(filter, sort as any, {
                watch: true, // this is the default
                state: true,
            });        

            return channels;
        } catch (e) {
            console.log(e)
        }        
    }

    static async checkIfBanned(userId: string) {
        try {
            return (await this.channel.queryMembers({id: userId}, {}, {})).members[0].banned;
        } catch (e) {
            console.log(e)
        }
    }
}