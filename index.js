import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActivityType, ActionRowBuilder } from 'discord.js';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const nicoRegex = /(?:nicovideo\.(?:jp|gay)\/watch\/)(sm\d+|nm\d+)/;
cloudinary.config({
  cloud_name: process.env.CLOUDY_NAME,
  api_key: process.env.CLOUDY_API_KEY,
  api_secret: process.env.CLOUDY_API_SECRET,
});
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: ['CHANNEL'], // DM対応
});
const PORT = process.env.PORT || 10000;
let botLoggedIn = false; // BOTログイン状態

async function loginBot() {
  if (botLoggedIn) return;
  try {
    await client.login(process.env.BOT_TOKEN);
    botLoggedIn = true;
    console.log(`✅ BOT logged in as ${client.user.tag}`);
  } catch (err) {
    console.error('❌ BOTログイン失敗:', err);
    botLoggedIn = false;
  }
}
loginBot();
const app = express();
app.get('/', async (req, res) => {
  if (!botLoggedIn) {
    return res.send('BOTは現在オフラインです。再起動してください。');
  }
  res.send(`BOTはオンラインです: ${client.user.tag}`);
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 HTTPサーバー起動: http://0.0.0.0:${PORT}`);
});

client.once('ready', () => {
  console.log(`${client.user.tag}にログインしたよ!`);

  // ステータスの設定
  client.user.setActivity('ﾊﾟﾐｭ～☆', {
    type: ActivityType.Watching
  });

  // オンライン状態（online, idle, dnd, invisible）
  client.user.setStatus('online');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '1487031369430204417') return;
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('approve_post')
        .setLabel('掲載を許可する')
        .setStyle(ButtonStyle.Success), // 緑色のボタン
      new ButtonBuilder()
        .setCustomId('deny_post')
        .setLabel('許可しない')
        .setStyle(ButtonStyle.Danger), // 赤色のボタン
    );
  const matchYT = message.content.match(ytRegex);
  if (matchYT) {
    const videoId = matchYT[1]; // これがID (例: IGe9bRr22dA)
    await message.reply({
      content: `この作品をサーバー公式サイトに掲載しちゃう？${videoId} \n` +
        `* ※許可を頂いた場合、当サイトの[利用規約・免責事項](https://blog2.chauchaucat.f5.si/)に同意したものとみなします。\n` +
        `* ※掲載後、削除を希望される場合は @ChauChauCat へ別途お問い合わせください。`,
      components: [row]
    });
  }
  const matchNC = message.content.match(nicoRegex);
  if (matchNC) {
    const videoId = matchNC[1];
    await message.reply({
      content: `この作品をサーバー公式サイトに掲載しちゃう？${videoId} \n` +
        `* ※許可を頂いた場合、当サイトの[利用規約・免責事項](https://blog2.chauchaucat.f5.si/)に同意したものとみなします。\n` +
        `* ※掲載後、削除を希望される場合は @ChauChauCat へ別途お問い合わせください。`,
      components: [row]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'approve_post' || interaction.customId === 'deny_post') {

    const messageReference = interaction.message.reference;

    // 返信元のメッセージが存在するかチェック
    if (['approve_post', 'deny_post'].includes(interaction.customId)) {
      const messageReference = interaction.message.reference;

      // 1. 返信元の紐付けがない場合（通常ありえませんが念のため）
      if (!messageReference || !messageReference.messageId) {
        return await interaction.message.delete().catch(() => { });
      }

      try {
        // 元のメッセージ（動画URLが貼られた投稿）を取得
        const originalMessage = await interaction.channel.messages.fetch(messageReference.messageId);

        // 2. 本人確認：ボタンを押した人と元の投稿者が違う場合
        if (interaction.user.id !== originalMessage.author.id) {
          return await interaction.reply({
            content: 'ごめん君にこの操作をする権限はないんだ',
            ephemeral: true
          });
        }
        const content = originalMessage.content;
        // 3. 本人だった場合の処理（ここに保存ロジックなどを書く）
        console.log(`本人確認完了 (ID: ${originalMessage.author.id}) - アクション: ${interaction.customId}`);

        const statusText = interaction.customId === 'approve_post' ? 'して' : 'しないで';
        await interaction.reply({
          content: `じゃあ掲載${statusText}おくね！` + `${interaction.customId === 'approve_post' ? '\n * ※掲載の取り消しを希望する場合は @ChauChauCat へお問い合わせください' : ''}`,
          ephemeral: true
        });
        await interaction.message.delete().catch(() => { });
        if (interaction.customId === 'approve_post') {
          const id = await getAndSaveVideoInfo(content);
          const { data, error } = await supabase
            .from('posts')
            .insert([
              {
                title: id.title,
                content: "ここにテキストを入力してね",
                thumbnail_url: id.thumbnailUrl
              }
            ])
            .select();
        }

      } catch (error) {
        // 4. 元のメッセージが削除されていた場合（fetch失敗）
        console.log(error);
        await interaction.message.delete().catch(() => { });
      }
    }
  }
});

/**
 * 動画の情報を取得し、最短URLとタイトル、サムネイルURLを返す
 * @param {string} text 
 * @returns {Promise<{url: string, title: string, thumbnailUrl: string}|null>}
 */
async function getAndSaveVideoInfo(text) {
  const combinedRegex = /(?:(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}))|(?:(?:https?:\/\/)?(?:www\.)?nicovideo\.jp\/watch\/(sm\d+|so\d+|nm\d+))/;

  const match = text.match(combinedRegex);
  if (!match) return null;

  let sourceImageUrl = "";
  let videoUrl = ""; // 最短URL用
  let videoTitle = "無題の動画";
  const randomId = crypto.randomBytes(4).toString('hex');

  try {
    if (match[1]) {
      // --- YouTube: youtu.be/ID ---
      const videoId = match[1];
      videoUrl = `https://youtu.be/${videoId}`;
      sourceImageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      try {
        const oembed = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        videoTitle = oembed.data.title;
      } catch (e) { /* fallback */ }

    } else if (match[2]) {
      // --- ニコニコ動画: nico.ms/ID ---
      const videoId = match[2];
      videoUrl = `https://nico.ms/${videoId}`;

      try {
        const xmlResponse = await axios.get(`https://ext.nicovideo.jp/api/getthumbinfo/${videoId}`);
        const xmlData = xmlResponse.data;
        const titleMatch = xmlData.match(/<title>(.*?)<\/title>/);
        if (titleMatch) videoTitle = titleMatch[1];

        const thumbMatch = xmlData.match(/<thumbnail_url>(.*?)<\/thumbnail_url>/);
        sourceImageUrl = thumbMatch ? thumbMatch[1] + '.L' : `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/${videoId}.L`;
      } catch (e) {
        sourceImageUrl = `https://nicovideo.cdn.nimg.jp/thumbnails/${videoId}/${videoId}.L`;
      }
    }

    // --- Cloudinary Upload ---
    let cloudinaryUrl = "";
    try {
      const result = await cloudinary.uploader.upload(sourceImageUrl, {
        public_id: `articles/${randomId}`,
        overwrite: false,
        // ここでリサイズとトリミングを指定
        transformation: [
          { width: 1200, height: 630, crop: "fill", gravity: "auto" },
          { fetch_format: "auto", quality: "auto" } // 最適化もついでに行うのがおすすめ
        ]
      });
      cloudinaryUrl = result.secure_url;
    } catch (error) {
      // YouTube maxresdefault 404 fallback
      if (match[1]) {
        const retryUrl = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        const retryResult = await cloudinary.uploader.upload(retryUrl, { public_id: `articles/${randomId}` });
        cloudinaryUrl = retryResult.secure_url;
      }
    }

    return {
      url: videoUrl,      // 最短URL
      title: videoTitle,  // 動画タイトル
      thumbnailUrl: randomId // Cloudinaryの画像URL
    };

  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}