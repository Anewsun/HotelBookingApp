import React, { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import RenderHtml from 'react-native-render-html';
import sanitizeHtml from 'sanitize-html';

const MemoizedHtmlContent = React.memo(({ rawHtml }) => {
    const cleanHtml = useMemo(() => {
        return sanitizeHtml(rawHtml || '', {
            allowedTags: ['p', 'img', 'b', 'i', 'em', 'strong', 'br'],
            allowedAttributes: {
                img: ['src', 'alt', 'width', 'height']
            }
        });
    }, [rawHtml]);

    return (
        <RenderHtml
            contentWidth={Dimensions.get('window').width - 32}
            source={{ html: cleanHtml }}
            tagsStyles={{
                img: styles.htmlImage,
                p: { marginVertical: 8 },
            }}
            imagesMaxWidth={Dimensions.get('window').width - 32}
        />
    );
});

export default MemoizedHtmlContent;

const styles = StyleSheet.create({
    htmlImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
});
