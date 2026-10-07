import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import mobileApi from '../api/client.js';

export const AIAssistantScreen = () => {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'ASSISTANT',
      content:
        'Hello! 👋 I am your PregnaCare AI Assistant. How can I help support your pregnancy journey, questions, or visit preparations today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    setInput('');
    const userMsg = { role: 'USER', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await mobileApi.sendChatMessage({ message: text });
      if (res?.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ASSISTANT',
          content:
            'The AI assistant is temporarily unavailable. Please consult your healthcare provider or try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PregnaCare AI Companion</Text>
        <Text style={styles.headerSub}>
          Educational and organizational guidance • Non-diagnostic
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {messages.map((m, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              m.role === 'USER' ? styles.userBubble : styles.aiBubble,
              m.isSafetyAlert && styles.alertBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                m.role === 'USER' ? styles.userText : styles.aiText,
                m.isSafetyAlert && styles.alertText,
              ]}
            >
              {m.content}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.bubble, styles.aiBubble]}>
            <ActivityIndicator color="#e64980" size="small" />
            <Text style={[styles.aiText, { marginTop: 4, fontSize: 11 }]}>
              PregnaCare AI is thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <ScrollView horizontal style={styles.suggestedBar}>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => handleSend('What happens during the second trimester?')}
          >
            <Text style={styles.pillText}>Second trimester changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => handleSend('What questions should I ask my doctor?')}
          >
            <Text style={styles.pillText}>Questions for doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => handleSend('Which doctor should I consult?')}
          >
            <Text style={styles.pillText}>Which doctor to consult?</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask a pregnancy question..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => handleSend()}
          disabled={isLoading || !input.trim()}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf9f8' },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1e8e8',
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  headerSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  scroll: { padding: 16, paddingBottom: 20 },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#e64980',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1e8e8',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  alertBubble: {
    backgroundColor: '#fff1f2',
    borderColor: '#fca5a5',
  },
  bubbleText: { fontSize: 13, lineHeight: 18 },
  userText: { color: '#fff' },
  aiText: { color: '#1e293b' },
  alertText: { color: '#881337', fontWeight: '600' },
  suggestedBar: { paddingHorizontal: 12, maxHeight: 40 },
  pill: {
    backgroundColor: '#fff0f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  pillText: { fontSize: 11, color: '#e64980', fontWeight: '700' },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1e8e8',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: '#e64980',
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});

export default AIAssistantScreen;
