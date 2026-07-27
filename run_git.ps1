$env:Path = "C:\Program Files\Git\cmd;" + $env:Path
git config user.email "dowook.ai.dev@gmail.com"
git config user.name "KIM DOWOOK"
git init
git add .
git commit -m "first commit: KIM DOWOOK AI Portfolio"
git branch -M main
git remote remove origin
git remote add origin https://github.com/hanguojindaoyu000510-lab/portfolio.git
git push -u origin main
