import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Stepper = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep - 1;
        const isActive = index === currentStep - 1;
        
        return (
          <View key={step} style={styles.stepContainer}>
            {index > 0 && (
              <View 
                style={[
                  styles.connector, 
                  isCompleted && styles.completedConnector,
                  isActive && styles.activeConnector
                ]} 
              />
            )}

            <View style={styles.stepContent}>
              <View 
                style={[
                  styles.circle,
                  isCompleted && styles.completedCircle,
                  isActive && styles.activeCircle
                ]}
              >
                <Text 
                  style={[
                    styles.stepNumber,
                    (isCompleted || isActive) && styles.activeStepNumber
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text 
                style={[
                  styles.stepText,
                  isCompleted && styles.completedStepText,
                  isActive && styles.activeStepText
                ]}
              >
                {step}
              </Text>
            </View>

            {index < steps.length - 1 && (
              <View 
                style={[
                  styles.connector, 
                  isCompleted && styles.completedConnector
                ]} 
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    position: 'relative',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  activeCircle: {
    backgroundColor: '#1167B1',
    borderColor: '#1167B1',
  },
  completedCircle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepNumber: {
    color: '#9e9e9e',
    fontWeight: 'bold',
    fontSize: 15
  },
  activeStepNumber: {
    color: 'white',
  },
  stepText: {
    marginTop: 5,
    color: '#9e9e9e',
    fontSize: 15,
    textAlign: 'center',
  },
  activeStepText: {
    color: '#1167B1',
    fontWeight: 'bold',
    fontSize: 15
  },
  completedStepText: {
    color: '#4CAF50',
    fontSize: 15
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: -1,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
  activeConnector: {
    backgroundColor: '#1167B1',
  },
});

export default Stepper;