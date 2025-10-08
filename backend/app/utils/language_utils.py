# utils/language_utils.py

# language_utils.py

def get_model_config(src_lang, tgt_lang):
    """
    Return the model name and MBART language codes for a given source and target.
    """
    # MBART model
    model_name = "facebook/mbart-large-50-many-to-many-mmt"

    # MBART language codes
    lang_codes = {
        "English": "en_XX",
        "Hindi": "hi_IN",
        "Japanese": "ja_XX",
        "Spanish": "es_XX",
        "Urdu": "ur_PK"
    }

    # Prevent unsupported Hindi -> Urdu
    if src_lang == "hi_IN" and tgt_lang == "ur_PK":
        return None

    if src_lang in lang_codes.values() and tgt_lang in lang_codes.values():
        return {
            "model": model_name,
            "src_lang": src_lang,
            "tgt_lang": tgt_lang
        }

    return None
