# Setup GitHub Authentication

## SSH Key Public Key Anda:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINSclpl7o4UlK0Kmfa9UF6lHP7qqMKCPFQ+3Nu+mi/3a perdh@RIYAN
```

## Cara 1: Setup SSH Key di GitHub (Recommended)

1. **Copy SSH Public Key di atas**
2. **Login ke GitHub** → https://github.com
3. **Settings** → **SSH and GPG keys**
4. **New SSH key**
5. **Title**: `essawit-project`
6. **Key**: Paste SSH public key di atas
7. **Add SSH key**

Setelah itu, jalankan:
```bash
git push -u origin main
```

## Cara 2: Setup Personal Access Token (PAT)

1. **Login ke GitHub** → https://github.com
2. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. **Note**: `essawit-project`
5. **Expiration**: Pilih durasi (contoh: 90 days)
6. **Select scopes**: Centang `repo` (full control of private repositories)
7. **Generate token**
8. **COPY TOKEN** (hanya muncul sekali!)

Setelah dapat token, jalankan perintah ini:
```bash
git remote set-url origin https://github.com/pspriyan29-pixel/essawit.git
git config credential.helper store
git push -u origin main
```
- **Username**: `pspriyan29-pixel`
- **Password**: Paste PAT token (bukan password GitHub)

## Status Saat Ini:
- ✅ Git repository initialized
- ✅ Remote origin sudah diatur (SSH)
- ✅ Commit sudah dibuat (96 files, 11,497 baris)
- ⏳ SSH key perlu ditambahkan ke GitHub atau setup PAT

