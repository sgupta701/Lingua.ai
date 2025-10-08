# translator.py

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

class Translator:
    def __init__(self):
        self.loaded_models = {}
        self.device = "cpu"  # Render free tier only has CPU

    def load_model(self, model_name):
        if model_name in self.loaded_models:
            return self.loaded_models[model_name]

        print(f"[INFO] Loading model: {model_name}")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSeq2SeqLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16  # save memory on CPU
        )
        model.to(self.device)
        model.eval()  # disable gradients

        self.loaded_models[model_name] = (tokenizer, model)
        return tokenizer, model

    def translate(self, text, model_name, src_lang=None, tgt_lang=None):
        if not text.strip():
            return ""

        tokenizer, model = self.load_model(model_name)

        inputs = tokenizer(
            text,
            return_tensors="pt",
            max_length=256,
            truncation=True
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            if "mbart" in model_name:
                tokenizer.src_lang = src_lang
                generated_tokens = model.generate(
                    **inputs,
                    forced_bos_token_id=tokenizer.lang_code_to_id[tgt_lang],
                    max_length=256
                )
            else:
                generated_tokens = model.generate(**inputs, max_length=256)

        output_text = tokenizer.decode(generated_tokens[0], skip_special_tokens=True)

        # Free memory
        del inputs, generated_tokens
        torch.cuda.empty_cache()  # safe on CPU

        return output_text



        
