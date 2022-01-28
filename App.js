import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, ChannelList } from "stream-chat-react-native";

const apiKey = "YOUR_API_KEY";
const userID = "YOUR_USER_ID";
const userToken = "YOUR_USER_TOKEN";

const chatClient = StreamChat.getInstance(apiKey);
const user = {
  id: userID,
};

const filters = {
  members: { $in: [user.id] },
  type: "messaging",
};
const sort = { last_message_at: -1 };
const options = {
  presence: true,
  state: true,
  watch: true,
  limit: 30,
};

export default function App() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function setupClient() {
      try {
        console.log("Setting up client");
        await chatClient.connectUser(user, userToken);
        console.log("Client is set up");
        setClient(chatClient);
      } catch (error) {
        throw new Error(`Error while connecting user: ${error.message}`);
      }
    }

    if (!chatClient.userID) {
      setupClient();
    }
  }, []);

  const onSelect = (channel) => {
    console.log(`Selected channel ${channel.id}`);
  };

  if (client === null) {
    return (
      <View style={styles.container}>
        <Text>Loading channel list</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <Chat client={client}>
      <View style={StyleSheet.absoluteFill}>
        <ChannelList
          filters={filters}
          options={options}
          sort={sort}
          onSelect={onSelect}
        />
      </View>
    </Chat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
