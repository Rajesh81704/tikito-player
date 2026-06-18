import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/src/components/Button';
import { C, radius } from '@/src/lib/theme';

type Props = {
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
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.82)',
          }}
        />

        <View
          style={{
            backgroundColor: C.card,
            borderRadius: 32,
            borderWidth: 1,
            borderColor: C.border,
            padding: 28,
            shadowColor: '#000',
            shadowOpacity: 0.35,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 12 },
            elevation: 12,
          }}
        >
          {/* Close */}
          <Pressable
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: C.elevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={18} color={C.textSecondary} />
          </Pressable>

          {/* Recommended Badge */}
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: C.goldGlow,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                color: C.gold,
                fontSize: 12,
                fontWeight: '700',
              }}
            >
              RECOMMENDED
            </Text>
          </View>

          {/* Icon */}
          <View
            style={{
              width: 82,
              height: 82,
              borderRadius: 41,
              backgroundColor: C.goldGlow,
              borderWidth: 1,
              borderColor: C.goldDim,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Ionicons
              name="location"
              size={38}
              color={C.gold}
            />
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: C.textPrimary,
              fontFamily: C.serif,
              marginBottom: 10,
            }}
          >
            Find Turfs Near You
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 15,
              lineHeight: 24,
              color: C.textSecondary,
              marginBottom: 24,
            }}
          >
            Enable location access so we can instantly show nearby grounds,
            local matches, and the best available slots in your city.
          </Text>

          {/* Benefits */}
          <View style={{ gap: 14, marginBottom: 28 }}>
            {[
              'Discover nearby turfs',
              'Get city-specific recommendations',
              'Faster booking experience',
            ].map((item) => (
              <View
                key={item}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={C.green}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    color: C.textPrimary,
                    fontSize: 14,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <Button
            loading={loading}
            onPress={onAccept}
            title="Enable Location"
          />

          <Pressable
            onPress={onClose}
            style={{
              alignItems: 'center',
              marginTop: 18,
            }}
          >
            <Text
              style={{
                color: C.textMuted,
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Continue without location
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}