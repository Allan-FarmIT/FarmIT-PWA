import * as tf from '@tensorflow/tfjs';
import { useToast } from "@/hooks/use-toast";
import type { Severity } from '@shared/schema';

let model: tf.GraphModel | null = null;
let isModelLoading = false;

export async function loadModel() {
  try {
    if (!model && !isModelLoading) {
      isModelLoading = true;
      console.log('Loading model...');

      // In production, this should load the actual Faster R-CNN model
      // For now using a mock model for testing
      model = {
        predict: async (tensor: tf.Tensor) => {
          // Mock Faster R-CNN predictions with bounding boxes and class scores
          return {
            boxes: tf.tensor2d([[100, 100, 200, 200]]), // [x1, y1, x2, y2]
            scores: tf.tensor1d([0.95]), // confidence scores
            classes: tf.tensor1d([1]), // class indices
          };
        }
      } as unknown as tf.GraphModel;

      console.log('Model loaded successfully');
      isModelLoading = false;
    }
    return model;
  } catch (error) {
    isModelLoading = false;
    console.error('Error loading model:', error);
    throw new Error('Failed to load pest detection model');
  }
}

function calculateSeverity(area: number, confidence: number): Severity {
  // Calculate severity based on the affected area and confidence score
  // Area is the percentage of the image affected by the pest/disease
  const areaPercentage = (area / (600 * 600)) * 100; // Using 600x600 as our standard size

  if (confidence < 70 || areaPercentage < 10) {
    return 'low';
  } else if (confidence < 85 || areaPercentage < 25) {
    return 'medium';
  } else {
    return 'high';
  }
}

export async function detectPest(imageElement: HTMLImageElement) {
  try {
    const model = await loadModel();
    if (!model) {
      throw new Error('Model not loaded');
    }

    // Preprocess image for Faster R-CNN
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([600, 600]) // Standard input size for Faster R-CNN
      .expandDims(0)
      .toFloat()
      .div(255.0);

    // Run Faster R-CNN inference
    const predictions = await model.predict(tensor) as {
      boxes: tf.Tensor2D,
      scores: tf.Tensor1D,
      classes: tf.Tensor1D
    };

    // Calculate area of detection (for severity)
    const boxes = await predictions.boxes.array();
    const area = (boxes[0][2] - boxes[0][0]) * (boxes[0][3] - boxes[0][1]);

    // Process results - for testing, using mock data
    // In production, this would process actual Faster R-CNN outputs
    const results = [
      {
        name: "Fall Armyworm",
        confidence: 95,
        description: "Common pest affecting maize crops",
        severity: calculateSeverity(area, 95),
        boundingBox: {
          x1: boxes[0][0],
          y1: boxes[0][1],
          x2: boxes[0][2],
          y2: boxes[0][3]
        }
      }
    ];

    // Cleanup tensors
    tensor.dispose();
    predictions.boxes.dispose();
    predictions.scores.dispose();
    predictions.classes.dispose();

    return results;
  } catch (error) {
    console.error('Error during detection:', error);
    throw new Error('Failed to analyze image');
  }
}