import { ChannelFilters, ChannelSort, Channel as StreamChannel, User } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  ChannelPreviewProps,
  Chat,
  MessageInput,
  VirtualizedMessageList,
  Window,
} from 'stream-chat-react';

// we'll reuse `useClient` hook from the "Add a Channel List" example
import { useClient } from './hooks/useClient';
import { EmojiPicker } from 'stream-chat-react/emojis';
import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';
import 'stream-chat-react/dist/css/v2/index.css';
import './layout.css';
import { useEffect, useState } from 'react';
init({ data });
const userId = 'frosty-band-9';
const userName = 'Dave';

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};

const apiKey = 'dz5f4d5kzrue';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZnJvc3R5LWJhbmQtOSIsImV4cCI6MTcxMjkyODA2OX0.DslDSjM25pDFgckKiWDeHwGmpMs_Ru6HIcaXYIWzV3c';

const sort: ChannelSort = { last_message_at: -1 };
const filters: ChannelFilters = {
  type: 'messaging',
  members: { $in: [userId] },
};

const CustomChannelPreview = (props: ChannelPreviewProps) => {
  const { channel, setActiveChannel } = props;

  const { messages } = channel.state;
  const messagePreview = messages[messages.length - 1]?.text?.slice(0, 30);

  return (
    <div
      onClick={() => setActiveChannel?.(channel)}
      style={{ margin: '12px', display: 'flex', gap: '5px' }}
    >
      <div>
        <img src={channel.data?.image} alt='channel-image' style={{ height: '36px' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div>{channel.data?.name || 'Unnamed Channel'}</div>
        {messagePreview && <div style={{ fontSize: '14px' }}>{messagePreview}</div>}
      </div>
    </div>
  );
};

const CustomMessage = () => {
  const { message } = useMessageContext();
  return (
    <div>
      <b style={{ marginRight: '4px' }}>{message.user?.name}</b> {message.text}
    </div>
  );
};

const App = () => {
  const chatClient = useClient({
    apiKey,
    user,
    tokenOrProvider: userToken,
  });

  const [channel, setChannel] = useState<StreamChannel>();
  useEffect(() => {
    if (!chatClient) return;

    const spaceChannel = chatClient.channel('livestream', 'NotionTheory-Audio-fm', {
      image: 'https://goo.gl/Zefkbx',
      name: 'NotionTheory Audio-fm',
    });

    setChannel(spaceChannel);
  }, [chatClient]);


  if (!chatClient) return null;

  // const channel = chatClient.channel('messaging', 'NotionTheory-Audio-fm', {
  //   // add as many custom fields as you'd like
  //   image: 'https://www.drupal.org/files/project-images/react.png',
  //   name: 'NotionTheory Audio-fm',
  //   members: [userId],
  // });

  return (
    <Chat client={chatClient} theme='str-chat__theme-dark'>
      <Channel channel={channel}  EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
        <Window>
          <ChannelHeader />
          <VirtualizedMessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default App;
