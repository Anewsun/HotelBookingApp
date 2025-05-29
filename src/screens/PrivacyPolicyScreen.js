import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { formatDate } from '../utils/dateUtils';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    const [policyDate, setpolicyDate] = useState(new Date());

    return (
        <View style={styles.container}>
            <Header title="Chính sách bảo mật" onBackPress={() => navigation.goBack()} showBackIcon={true} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Chính sách bảo mật</Text>
                <Text style={styles.paragraph}>
                    Quyền riêng tư của bạn rất quan trọng đối với chúng tôi. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và tiết lộ thông tin về bạn khi bạn sử dụng dịch vụ của chúng tôi.
                </Text>
                <Text style={styles.subTitle}>Thông tin chúng tôi thu thập</Text>
                <Text style={styles.paragraph}>
                    Chúng tôi thu thập thông tin mà bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, thực hiện giao dịch mua hoặc liên hệ với chúng tôi để được hỗ trợ.
                </Text>
                <Text style={styles.subTitle}>Chúng tôi sử dụng thông tin này như thế nào?</Text>
                <Text style={styles.paragraph}>
                    Chúng tôi sử dụng thông tin này cho:
                </Text>
                <Text style={styles.listItem}>- Cung cấp, duy trì và cải thiện các dịch vụ của chúng tôi.</Text>
                <Text style={styles.listItem}>- Xử lý giao dịch và gửi cho bạn thông tin liên quan.</Text>
                <Text style={styles.listItem}>- Trao đổi với bạn về sản phẩm, dịch vụ và chương trình khuyến mãi.</Text>
                <Text style={styles.subTitle}>Chia sẻ thông tin của bạn</Text>
                <Text style={styles.paragraph}>
                    Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi có thể chia sẻ thông tin của bạn với các nhà cung cấp dịch vụ bên thứ ba để thực hiện dịch vụ thay mặt chúng tôi.
                </Text>
                <Text style={styles.subTitle}>Quyền của bạn</Text>
                <Text style={styles.paragraph}>
                    Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi.                </Text>
                <Text style={styles.subTitle}>Những thay đổi đối với Chính sách bảo mật này</Text>
                <Text style={styles.paragraph}>
                    Chúng tôi có thể cập nhật Chính sách bảo mật của mình theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính sách bảo mật mới trên trang này.                </Text>
                <Text style={styles.paragraph}>
                    Chính sách này có hiệu lực kể từ {formatDate(policyDate)}.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 15
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 22,
    },
    listItem: {
        fontSize: 16,
        marginBottom: 5,
        lineHeight: 22,
        marginLeft: 10,
    },
});

export default PrivacyPolicyScreen;
