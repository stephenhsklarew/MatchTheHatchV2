# Your Turn: Train the Model in Google Colab

My part of the machine learning pipeline setup is complete. The next step, which requires a GPU, is for you to run the training notebook in Google Colab.

Here’s a summary of what we have accomplished:

1.  **Data Collection:** We have downloaded approximately 200 images for each of our 5 target classes and saved their corresponding metadata to `metadata.csv`.
2.  **Training Notebook:** We have a complete Jupyter Notebook (`train_model.ipynb`) that will:
    *   Load and prepare the data.
    *   Define a mobile-optimized **MobileNetV3** model.
    *   Train the model using best practices like transfer learning and fine-tuning.
    *   Convert the final model to the `model.tflite` format for use in our mobile app.
    *   Save the class names to a `labels.txt` file.

### Instructions for Google Colab

1.  **Prepare Your Data:** Create a `.zip` file of the `ml_model/data` directory that I created. You can do this by navigating to the `MatchTheHatchV2/ml_model/` directory in your terminal and running:
    ```bash
    zip -r data.zip data/
    ```
2.  **Go to Google Colab:** Open [colab.research.google.com](https://colab.research.google.com) in your browser.
3.  **Upload Notebook:** In Colab, click `File -> Upload notebook...` and select the `train_model.ipynb` file from the `MatchTheHatchV2/ml_model/` directory.
4.  **Enable GPU:** In the Colab notebook, go to `Runtime -> Change runtime type` and select `T4 GPU` from the "Hardware accelerator" dropdown.
5.  **Upload Data:** In the file browser on the left side of the Colab interface, click the "Upload to session storage" button (it looks like a folder with an arrow pointing up) and upload the `data.zip` file you created in step 1.
6.  **Unzip Data:** Add a new code cell at the top of the notebook (or just below the initial imports) and run the following command to unzip your data:
    ```python
    !unzip -q data.zip
    ```
    (Note: The `data` directory will be created in the Colab environment's root, accessible by the notebook.)
7.  **Run All Cells:** Click `Runtime -> Run all` to execute all the cells in the notebook. This will start the training process, which may take some time.

After the notebook has finished running, you will be able to download two crucial files from the Colab environment:

*   `model.tflite` (your trained TensorFlow Lite model)
*   `labels.txt` (the list of class names in the correct order for the model)

Once you have successfully trained the model and downloaded these two files, please let me know, and we can begin building the Flutter app.
