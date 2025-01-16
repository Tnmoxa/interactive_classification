import numpy as np
from PIL import Image
from scipy import stats
from sklearn.utils import shuffle
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
import rasterio
from rasterio.transform import from_origin
from rasterio.features import shapes

def preprocess(image_np, landcover_np):

    image_np = image_np[:, :, :3]  # Используем первые три канала (B2, B3, B4)

    if landcover_np.ndim == 3 and landcover_np.shape[2] == 1:
        landcover_np = landcover_np[:, :, 0]

    # Обрезаем массивы до минимальных общих размеров
    min_height = min(image_np.shape[0], landcover_np.shape[0])
    min_width = min(image_np.shape[1], landcover_np.shape[1])

    image_np = image_np[:min_height, :min_width, :]
    landcover_np = landcover_np[:min_height, :min_width]

    # Удаляем возможные значения NaN
    image_np = np.nan_to_num(image_np)
    landcover_np = np.nan_to_num(landcover_np)
    return image_np, landcover_np

def create_patches_for_prediction(img_array, patch_size):
    img_patches = []
    coords = []  # Для сохранения координат патчей
    h, w, c = img_array.shape

    # Обрезаем изображение до размеров, кратных размеру патча
    h_new = (h // patch_size) * patch_size
    w_new = (w // patch_size) * patch_size
    img_array = img_array[:h_new, :w_new, :]

    for i in range(0, h_new, patch_size):
        for j in range(0, w_new, patch_size):
            img_patch = img_array[i:i+patch_size, j:j+patch_size, :]
            img_patches.append(img_patch)
            coords.append((i, j))
    return np.array(img_patches), coords

def create_patches(img_array, mask_array, patch_size):
    img_patches = []
    mask_patches = []
    h, w = img_array.shape[:2]

    for i in range(0, h - patch_size + 1, patch_size):
        for j in range(0, w - patch_size + 1, patch_size):
            img_patch = img_array[i:i+patch_size, j:j+patch_size, ...]
            mask_patch = mask_array[i:i+patch_size, j:j+patch_size, ...]

            # Проверяем размеры патчей
            if img_patch.shape[:2] == (patch_size, patch_size):
                img_patches.append(img_patch)
                mask_patches.append(mask_patch)
            else:
                # Пропускаем неполные патчи
                continue
    return np.array(img_patches), np.array(mask_patches)

def predict(img_patches, mask_patches, image_np, patch_size):
    # Преобразуем данные для обучения
    x = img_patches.reshape(img_patches.shape[0], -1)
    y = mask_patches.reshape(mask_patches.shape[0], -1)

    y_mode = stats.mode(y, axis=1)[0]
    y = y_mode.flatten()

    x_shuffled, y_shuffled = shuffle(x, y, random_state=42)

    x_train, x_test, y_train, y_test = train_test_split(x_shuffled, y_shuffled, test_size=0.2, random_state=42)

    models = {
        'K-Nearest Neighbors': KNeighborsClassifier(),
        'Decision Tree': DecisionTreeClassifier(),
        'Random Forest': RandomForestClassifier(),
        'Naive Bayes': GaussianNB(),
    }

    accuracies = {}
    for name, model in models.items():
        model.fit(x_train, y_train)
        y_pred = model.predict(x_test)
        acc = accuracy_score(y_test, y_pred)
        accuracies[name] = acc





    best_model_name = max(accuracies, key=accuracies.get)
    best_model = models[best_model_name]

    img_patches_full, coords = create_patches_for_prediction(image_np, patch_size)
    x_full = img_patches_full.reshape(img_patches_full.shape[0], -1)

    best_model_name = max(accuracies, key=accuracies.get)
    best_model = models[best_model_name]

    img_patches_full, coords = create_patches_for_prediction(image_np, patch_size)
    x_full = img_patches_full.reshape(img_patches_full.shape[0], -1)


    y_pred_full = best_model.predict(x_full)
    k_nearest=models['K-Nearest Neighbors'].predict(x_full)
    decision_tree=models['Decision Tree'].predict(x_full)
    random_forest=models['Random Forest'].predict(x_full)
    naice_bayes=models['Naive Bayes'].predict(x_full)

    index = 0
    mask_k_nearest = np.zeros((image_np.shape[0], image_np.shape[1]), dtype=np.uint8)
    for (i, j) in coords:
        mask_k_nearest[i:i + patch_size, j:j + patch_size] = k_nearest[index]
        index += 1
    index = 0
    mask_decision_tree = np.zeros((image_np.shape[0], image_np.shape[1]), dtype=np.uint8)
    for (i, j) in coords:
        mask_decision_tree[i:i + patch_size, j:j + patch_size] = decision_tree[index]
        index += 1
    index = 0
    mask_random_forest = np.zeros((image_np.shape[0], image_np.shape[1]), dtype=np.uint8)
    for (i, j) in coords:
        mask_random_forest[i:i + patch_size, j:j + patch_size] = random_forest[index]
        index += 1
    index = 0
    mask_naice_bayes = np.zeros((image_np.shape[0], image_np.shape[1]), dtype=np.uint8)
    for (i, j) in coords:
        mask_naice_bayes[i:i + patch_size, j:j + patch_size] = naice_bayes[index]
        index += 1
    index = 0
    mask_pred = np.zeros((image_np.shape[0], image_np.shape[1]), dtype=np.uint8)
    for (i, j) in coords:
        mask_pred[i:i + patch_size, j:j + patch_size] = y_pred_full[index]
        index += 1

    return mask_k_nearest, mask_decision_tree, mask_random_forest, mask_naice_bayes, mask_pred
