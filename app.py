#!/usr/bin/env python3
"""
简单的 Flask 后端服务，用于控制 ai.py 脚本的启动和停止
"""

from flask import Flask, jsonify, render_template_string
from flask_cors import CORS
import subprocess
import os
import signal
import psutil
import threading
import time
import sys

app = Flask(__name__)
CORS(app)

# 全局变量存储进程信息
current_process = None
process_lock = threading.Lock()

def is_process_running(process):
    """检查进程是否仍在运行"""
    if process is None:
        return False
    try:
        return process.poll() is None
    except:
        return False

def kill_process_tree(pid):
    """终止进程及其子进程"""
    try:
        parent = psutil.Process(pid)
        children = parent.children(recursive=True)
        
        # 先终止子进程
        for child in children:
            try:
                child.terminate()
            except psutil.NoSuchProcess:
                pass
        
        # 等待子进程终止
        gone, still_alive = psutil.wait_procs(children, timeout=3)
        
        # 强制杀死仍然存活的子进程
        for p in still_alive:
            try:
                p.kill()
            except psutil.NoSuchProcess:
                pass
        
        # 终止父进程
        try:
            parent.terminate()
            parent.wait(timeout=3)
        except psutil.TimeoutExpired:
            parent.kill()
            
    except psutil.NoSuchProcess:
        pass

@app.route('/')
def index():
    """Main page"""
    return render_template_string('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Script Controller</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            min-width: 300px;
        }
        
        .btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            min-width: 150px;
            margin: 10px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .btn:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .btn.stop {
            background: linear-gradient(45deg, #f44336, #da190b);
            box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
        }
        
        .btn.stop:hover {
            box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
        }
        
        .controls {
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="controls">
            <button class="btn" id="startBtn" onclick="startScript()">Start AI</button>
            <button class="btn stop" id="stopBtn" onclick="stopScript()" disabled>Stop AI</button>
        </div>
    </div>

    <script>
        let isRunning = false;
        
        function updateButtons() {
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            
            startBtn.disabled = isRunning;
            stopBtn.disabled = !isRunning;
        }
        
        async function startScript() {
            try {
                const response = await fetch('/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();
                
                if (data.success) {
                    isRunning = true;
                    updateButtons();
                }
                
            } catch (error) {
                console.error('Start failed:', error);
            }
        }
        
        async function stopScript() {
            try {
                const response = await fetch('/stop', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();
                
                if (data.success) {
                    isRunning = false;
                    updateButtons();
                }
                
            } catch (error) {
                console.error('Stop failed:', error);
            }
        }
        
        async function checkStatus() {
            try {
                const response = await fetch('/status');
                const data = await response.json();
                
                isRunning = data.running;
                updateButtons();
                
            } catch (error) {
                console.error('Status check failed:', error);
            }
        }
        
        // Check status on page load
        window.onload = function() {
            checkStatus();
            // Auto-check every 5 seconds
            setInterval(checkStatus, 5000);
        };
    </script>
</body>
</html>
    ''')

@app.route('/start', methods=['POST'])
def start_script():
    """启动 ai.py 脚本"""
    global current_process
    
    with process_lock:
        # 检查是否已经有进程在运行
        if current_process and is_process_running(current_process):
            return jsonify({
                'success': False,
                'message': '脚本已在运行中'
            })
        
        try:
            # 确保 ai.py 文件存在
            if not os.path.exists('ai.py'):
                return jsonify({
                    'success': False,
                    'message': '找不到 ai.py 文件'
                })
            
            # 获取当前 Python 解释器路径
            python_cmd = sys.executable
            
            # 确保使用虚拟环境
            current_env = os.environ.copy()
            
            # 如果在虚拟环境中，确保 PATH 正确
            if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
                # 在虚拟环境中
                venv_path = os.path.dirname(python_cmd)
                if 'PATH' in current_env:
                    current_env['PATH'] = venv_path + os.pathsep + current_env['PATH']
                else:
                    current_env['PATH'] = venv_path
                
                print(f"检测到虚拟环境，使用 Python: {python_cmd}")
                print(f"虚拟环境路径: {venv_path}")
            else:
                print(f"使用系统 Python: {python_cmd}")
            
            # 启动新进程，确保环境正确
            current_process = subprocess.Popen(
                [python_cmd, 'ai.py'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                stdin=subprocess.PIPE,
                env=current_env,
                text=True,
                bufsize=1,
                cwd=os.getcwd()
            )
            
            # 等待一小段时间确保进程启动
            time.sleep(0.5)
            
            # 检查进程是否成功启动
            if current_process.poll() is None:
                return jsonify({
                    'success': True,
                    'message': '脚本启动成功',
                    'pid': current_process.pid
                })
            else:
                # 进程立即退出，可能有错误
                stdout, stderr = current_process.communicate()
                return jsonify({
                    'success': False,
                    'message': f'脚本启动失败: {stderr or stdout}'
                })
                
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'启动失败: {str(e)}'
            })

@app.route('/stop', methods=['POST'])
def stop_script():
    """停止 ai.py 脚本"""
    global current_process
    
    with process_lock:
        if not current_process or not is_process_running(current_process):
            return jsonify({
                'success': False,
                'message': '没有运行中的脚本'
            })
        
        try:
            # 获取进程 ID
            pid = current_process.pid
            
            # 首先尝试优雅地终止进程
            try:
                current_process.terminate()
                current_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                # 如果优雅终止失败，强制杀死进程树
                kill_process_tree(pid)
            
            current_process = None
            
            return jsonify({
                'success': True,
                'message': '脚本已停止'
            })
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'停止失败: {str(e)}'
            })

@app.route('/debug')
def debug_env():
    """调试环境信息"""
    info = {
        'python_executable': sys.executable,
        'python_version': sys.version,
        'virtual_env': os.environ.get('VIRTUAL_ENV', 'None'),
        'in_venv': hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix),
        'current_dir': os.getcwd(),
        'ai_py_exists': os.path.exists('ai.py'),
        'path_env': os.environ.get('PATH', '').split(os.pathsep)[:5]
    }
    
    return jsonify(info)

@app.route('/status')
def get_status():
    """获取脚本运行状态"""
    global current_process
    
    with process_lock:
        running = current_process and is_process_running(current_process)
        
        return jsonify({
            'running': running,
            'pid': current_process.pid if running else None
        })

if __name__ == '__main__':
    print("启动 AI 脚本控制器...")
    print("请确保 ai.py 文件在当前目录中")
    print("访问 http://localhost:5000 来控制脚本")
    
    app.run(debug=True, host='0.0.0.0', port=5000)