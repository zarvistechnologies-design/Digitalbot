@echo off
echo ============================================
echo KAGGLE DATASET PREPARATION
echo ============================================
echo.
echo PLEASE CLOSE:
echo - Excel
echo - Any program with UpdatedResumeDataSet.csv open
echo.
pause
echo.
echo Running preparation script...
python scripts\prepare_dataset.py --kaggle-csv UpdatedResumeDataSet.csv
echo.
pause
