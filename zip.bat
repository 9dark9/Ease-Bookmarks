color 0A
title ���Ϊzip

rem ָ��WINRAR·��
set "path=%path%;D:\Program Files\WinRAR"

cd src
:: dependencies
:: npm install clean-css-cli -g
:: npm install terser -g
pushd css
call cleancss -o popup.css popup.css
popd
pushd js
call terser config.js -o config.js
call terser popup.js -o popup.js
popd

cd..
WinRAR a -r -ibck -inul -ep1 ^
src.zip ^
src\*

:: -r :��ͬ���ļ���
:: -ibck :��̨����
:: -inul :��ֹ������Ϣ
:: -ep1 :���������ų����ļ���(src)

cls
echo ������ ��ȷ�ϣ�����
echo.
echo ���������ԭ��ѹ�����ļ�(js��css)...
echo ���� ֱ�ӹر��˳�
pause>nul

git checkout .
