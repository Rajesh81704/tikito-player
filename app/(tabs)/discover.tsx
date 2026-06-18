import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FullScreenLoader } from '@/src/components/FullScreenLoader';
import { TurfFieldCard } from '@/src/components/TurfFieldCard';
import { useTurfsQuery } from '@/src/hooks/use-auth';
import { C, radius } from '@/src/lib/theme';

export default function DiscoverScreen() {
  const turfsQuery = useTurfsQuery('', true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTurfs = useMemo(() => {
    if (!turfsQuery.data) return [];
    const q = searchQuery.toLowerCase();
    return turfsQuery.data.filter(t =>
      t.turf_name.toLowerCase().includes(q) || (t.turf_location && t.turf_location.toLowerCase().includes(q))
    );
  }, [searchQuery, turfsQuery.data]);

  if (turfsQuery.isLoading) return <FullScreenLoader label="Finding the best turfs..." />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['left', 'right']}>
      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 14, borderRadius: radius.lg, backgroundColor: C.elevated, borderWidth: 1, borderColor: C.border, gap: 10 }}>
          <Ionicons name="search" size={18} color={C.textMuted} />
          <TextInput
            placeholder="Search by name or city..."
            placeholderTextColor={C.textMuted}
            style={{ flex: 1, fontSize: 15, color: C.textPrimary, fontFamily: C.sans }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            selectionColor={C.gold}
          />
          {searchQuery.length > 0 && (
            <Ionicons name="close-circle" size={18} color={C.textMuted} onPress={() => setSearchQuery('')} />
          )}
        </View>
      </View>

      {turfsQuery.isError ? (
        <View style={{ margin: 16, borderRadius: radius.lg, backgroundColor: 'rgba(224,82,82,0.1)', borderWidth: 1, borderColor: 'rgba(224,82,82,0.25)', padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.error, fontFamily: C.sans }}>Error loading turfs.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTurfs}
          keyExtractor={item => item.turf_field_id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          columnWrapperStyle={{ gap: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <TurfFieldCard
              turf={item}
              onPress={() => router.push({ pathname: '/turf/[turfId]', params: { turfId: item.turf_field_id, turf: JSON.stringify(item) } })}
            />
          )}
          ListEmptyComponent={
            <View style={{ marginTop: 60, alignItems: 'center' }}>
              <Ionicons name="football-outline" size={40} color={C.border} />
              <Text style={{ marginTop: 14, fontSize: 18, fontWeight: '700', color: C.textPrimary, fontFamily: C.serif }}>No turfs found</Text>
              <Text style={{ marginTop: 6, fontSize: 13, color: C.textMuted, fontFamily: C.sans }}>Try a different search</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
