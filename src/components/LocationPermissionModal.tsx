import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';

type LocationPermissionModalProps = {
  visible: boolean;
  loading?: boolean;
  onAccept: () => void;
  onClose: () => void;
};

export function LocationPermissionModal({
  visible,
  loading = false,
  onAccept,
  onClose,
}: LocationPermissionModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View className="flex-1 justify-center">
        <Pressable
          className="absolute inset-0 bg-slate-950/55"
          onPress={onClose}
        />

        <View className="mx-5 rounded-[32px] border border-slate-200 bg-white px-6 py-7 shadow-2xl">
          <View className="gap-6">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-teal-50">
              <Ionicons color="#0F766E" name="location" size={28} />
            </View>

            <View className="gap-2.5">
              <Text className="text-[28px] font-bold leading-8 text-slate-900">
                Enable your location
              </Text>
              <Text className="text-base leading-6 text-slate-600">
                We&apos;ll detect your city from your current location and make
                nearby turf discovery feel instant.
              </Text>
            </View>

            <View className="gap-3">
              <Button loading={loading} onPress={onAccept} title="Continue" />

              <Pressable
                className="items-center justify-center rounded-2xl py-3"
                onPress={onClose}
              >
                <Text className="text-sm font-semibold text-slate-500">
                  Not now
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
