// AI タグ付けシステム

interface TagSuggestion {
  tag: string
  confidence: number
}

/**
 * AIを使用して投稿にタグを提案する
 */
export async function suggestTags(
  preface: string,
  content: string
): Promise<string[]> {
  // OpenAI APIを使用してタグを生成
  // 環境変数にAPIキーがない場合は、基本的なキーワード抽出を使用
  
  if (!process.env.OPENAI_API_KEY) {
    return extractKeywordTags(preface + ' ' + content)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `あなたはトリビア投稿に適切なタグを提案するアシスタントです。
投稿内容から3〜5個の関連するタグを日本語で提案してください。
タグはカテゴリ（例：科学、歴史、動物、地理、文化、技術など）を表す単語にしてください。
JSON配列形式で返してください: ["タグ1", "タグ2", "タグ3"]`,
          },
          {
            role: 'user',
            content: `前段: ${preface}\n\nトリビア: ${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API error')
    }

    const data = await response.json()
    const tagsText = data.choices[0].message.content
    const tags = JSON.parse(tagsText)
    
    return tags.slice(0, 5)
  } catch (error) {
    console.error('AI tag suggestion failed:', error)
    return extractKeywordTags(preface + ' ' + content)
  }
}

/**
 * 基本的なキーワード抽出によるタグ生成（フォールバック）
 */
function extractKeywordTags(text: string): string[] {
  const categoryKeywords: { [key: string]: string[] } = {
    '科学': ['科学', '実験', '研究', '発見', '理論', '分子', '原子', '化学', '物理'],
    '歴史': ['歴史', '時代', '年', '世紀', '発明', '昔', '古代', '戦争'],
    '動物': ['動物', '生物', '犬', '猫', '鳥', '魚', '昆虫', '哺乳類'],
    '地理': ['地理', '国', '都市', '山', '川', '海', '大陸', '地球'],
    '文化': ['文化', '伝統', '習慣', '祭り', '芸術', '音楽', '言語'],
    '技術': ['技術', 'コンピュータ', 'インターネット', '発明', '機械', 'AI'],
    '食': ['食', '料理', '食べ物', '飲み物', 'レシピ', '栄養'],
    '健康': ['健康', '医療', '病気', '治療', '運動', '睡眠'],
    '自然': ['自然', '天気', '気候', '環境', '生態系', '植物'],
    '宇宙': ['宇宙', '星', '惑星', '銀河', 'NASA', '天文'],
  }

  const detectedTags: string[] = []
  const lowerText = text.toLowerCase()

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!detectedTags.includes(category)) {
          detectedTags.push(category)
        }
        break
      }
    }
  }

  return detectedTags.slice(0, 3)
}
