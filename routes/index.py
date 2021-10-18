import json, sys, io, os
##import subprocess
##import base64
##from IPython.display import Image

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

def main():
    ##imgstring = sys.stdin.read()
    ##imgdata=base64.b64decode(imgstring)
    ##filename = './images/test.jpg'
    ##with open(filename, 'wb') as f:
    ##    f.write(imgdata)
##
    ##val_img_path = './images/test.jpg'
    ####sys.argv = ['--weights', './detect/k_v5m_epochs50_data20_img640.pt', '--img', 640, '--conf', 0.1, '--source', "{val_img_path}"];
    ####exec('detect.py');
    ##subprocess.call([sys.executable, './detect.py', '--weights', './detect/k_v5m_epochs50_data20_img640.pt', '--img', '640', '--conf', '0.1', '--source', val_img_path])
    ##
    ##tmp = Image(os.path.join('./detect', os.path.basename(val_img_path)))

    print("감자")

if __name__ == '__main__':
    main()