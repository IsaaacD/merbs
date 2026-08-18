class FloatingTextBackground {
    constructor(config = {}) {
        this.config = {
            mode: config.mode || 'background',
            introDuration: config.introDuration || 6000,
            textCount: config.textCount || 12,
            particleCount: config.particleCount || 150,
            textSpeed: config.textSpeed || 0.15,
            particleSpeed: config.particleSpeed || 0.02,
            textColor: config.textColor || '#ffffff',
            particleColor: config.particleColor || '#ffffff',
            bgColor: config.bgColor || '#0a0a1a',
            fontFamily: config.fontFamily || "'Segoe UI', Arial, sans-serif",
            textPool: config.textPool || [
                'DevOps Engineer',
                'Clean Code',
                'Solutions Developer',
                'Cloud Architecture',
                'CI/CD Pipelines',
                'Infrastructure as Code',
                'Microservices',
                'Kubernetes',
                'Automation',
                'Full Stack',
                'System Design',
                'Performance Tuning',
                'Container Orchestration',
                'Monitoring & Observability',
                'GitOps',
                'Terraform',
                'Docker',
                'Linux Systems',
                'API Development',
                'Database Design'
            ],
            ...config
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.textMeshes = [];
        this.particles = null;
        this.particlePositions = null;
        this.particleVelocities = null;
        this.clock = null;
        this.isRunning = false;
        this.canvas = null;
        this.animationId = null;
        this.fadeStartTime = null;
    }

    init() {
        this._createCanvas();
        this._createRenderer();
        this._createScene();
        this._createCamera();
        this._createParticles();
        this._spawnTextPool();
        this.isRunning = true;
        this.clock = new THREE.Clock();
        this._animate();
    }

    _createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'three-bg-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        document.body.prepend(this.canvas);
    }

    _createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(new THREE.Color(this.config.bgColor), 1);
    }

    _createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(
            new THREE.Color(this.config.bgColor),
            0.005
        );
    }

    _createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;
    }

    _createTextTexture(text, fontSize = 36) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const padding = 30;

        ctx.font = `400 ${fontSize}px ${this.config.fontFamily}`;
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize * 1.4;

        canvas.width = textWidth + padding * 2;
        canvas.height = textHeight + padding * 2;

        ctx.font = `400 ${fontSize}px ${this.config.fontFamily}`;
        ctx.fillStyle = this.config.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(108, 92, 231, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    _marginPosition() {
        const cameraZ = 50;
        const aspectRatio = window.innerWidth / window.innerHeight;
        const halfFovRad = THREE.MathUtils.degToRad(30);
        const textZ = 25;
        const visibleHalfWidth = Math.tan(halfFovRad) * textZ * aspectRatio;
        const contentHalfWidth = visibleHalfWidth * 0.3;

        const side = Math.random() < 0.5 ? -1 : 1;
        const marginRange = visibleHalfWidth * 0.6;
        const x = side * (contentHalfWidth + Math.random() * marginRange);

        const y = (Math.random() - 0.5) * 22;
        return { x, y, z: textZ };
    }

    _createTextMesh(text) {
        const texture = this._createTextTexture(text);
        const aspect = texture.image.width / texture.image.height;
        const height = 2.5 + Math.random() * 1.5;
        const width = height * aspect;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.NormalBlending,
            side: THREE.DoubleSide
        });

        const geometry = new THREE.PlaneGeometry(width, height);
        const mesh = new THREE.Mesh(geometry, material);

        const pos = this._marginPosition();
        mesh.position.set(pos.x, pos.y, pos.z);

        mesh.userData = {
            baseY: pos.y,
            baseRotationZ: (Math.random() - 0.5) * 0.1,
            floatSpeedX: 0.1 + Math.random() * 0.5,
            floatSpeedY: 0.1 + Math.random() * 0.5,
            floatAmplitudeX: 1 + Math.random() * 3,
            floatAmplitudeY: 1 + Math.random() * 3,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            currentOpacity: 0,
            fadeInSpeed: 0.05 + Math.random() * 0.25,
            fadeOutSpeed: 0.05 + Math.random() * 0.2,
            maxOpacity: 0.05 + Math.random() * 0.12,
            activeDuration: 4 + Math.random() * 8,
            lifetime: 0,
            state: 'entering',
            rotationSpeed: (Math.random() - 0.5) * 0.002,
            texture: texture,
            geometry: geometry
        };

        return mesh;
    }

    _spawnTextPool() {
        for (let i = 0; i < this.config.textCount; i++) {
            const text = this.config.textPool[Math.floor(Math.random() * this.config.textPool.length)];
            const mesh = this._createTextMesh(text);
            mesh.userData.delay = i * (80 / this.config.textCount);
            this.scene.add(mesh);
            this.textMeshes.push(mesh);
        }
    }

    _createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.config.particleCount * 3);
        const sizes = new Float32Array(this.config.particleCount);
        this.particleVelocities = new Float32Array(this.config.particleCount * 3);

        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 80;
            positions[i3 + 1] = (Math.random() - 0.5) * 60;
            positions[i3 + 2] = (Math.random() - 0.5) * 40 - 10;

            this.particleVelocities[i3] = (Math.random() - 0.5) * this.config.particleSpeed;
            this.particleVelocities[i3 + 1] = (Math.random() - 0.5) * this.config.particleSpeed;
            this.particleVelocities[i3 + 2] = (Math.random() - 0.5) * this.config.particleSpeed * 0.3;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleCanvas = document.createElement('canvas');
        particleCanvas.width = 32;
        particleCanvas.height = 32;
        const pCtx = particleCanvas.getContext('2d');
        const gradient = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        pCtx.fillStyle = gradient;
        pCtx.fillRect(0, 0, 32, 32);

        const particleTexture = new THREE.CanvasTexture(particleCanvas);

        const material = new THREE.PointsMaterial({
            map: particleTexture,
            size: 0.8,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            color: new THREE.Color(this.config.particleColor)
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    _updateTextMeshes(delta) {
        const elapsed = this.clock.getElapsedTime();

        this.textMeshes.forEach((mesh) => {
            const ud = mesh.userData;
            ud.lifetime += delta;

            if (ud.lifetime < ud.delay) return;

            const activeTime = ud.lifetime - ud.delay;

            if (ud.state === 'entering') {
                ud.currentOpacity = Math.min(
                    ud.currentOpacity + ud.fadeInSpeed,
                    ud.maxOpacity
                );
                if (ud.currentOpacity >= ud.maxOpacity) {
                    ud.state = 'active';
                }
            } else if (ud.state === 'active') {
                ud.currentOpacity = ud.maxOpacity;
                if (activeTime > ud.activeDuration) {
                    ud.state = 'exiting';
                }
            } else if (ud.state === 'exiting') {
                ud.currentOpacity = Math.max(
                    ud.currentOpacity - ud.fadeOutSpeed,
                    0
                );
                if (ud.currentOpacity <= 0) {
                    this._respawnText(mesh);
                }
            }

            mesh.material.opacity = ud.currentOpacity || 0;

            mesh.position.x += Math.sin(elapsed * ud.floatSpeedX + ud.phaseX) * ud.floatAmplitudeX * delta;
            mesh.position.y = ud.baseY + Math.sin(elapsed * ud.floatSpeedY + ud.phaseY) * ud.floatAmplitudeY * delta;
            mesh.position.z += Math.sin(elapsed * 0.1 + ud.phase) * 0.002;

            mesh.rotation.z = ud.baseRotationZ + Math.sin(elapsed * 0.5 + ud.phase) * 0.02;
            mesh.rotation.y += ud.rotationSpeed;
            mesh.rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mesh.rotation.y));

            const aspectRatio = window.innerWidth / window.innerHeight;
            const halfFovRad = THREE.MathUtils.degToRad(30);
            const textZ = 25;
            const visibleHalfWidth = Math.tan(halfFovRad) * textZ * aspectRatio;
            const contentHalfWidth = visibleHalfWidth * 0.3;
            const marginMin = contentHalfWidth + 0.5;
            const marginMax = visibleHalfWidth * 0.95;
            if (mesh.position.x > marginMax) mesh.position.x = -marginMax;
            if (mesh.position.x < -marginMax) mesh.position.x = marginMax;
            if (Math.abs(mesh.position.x) < marginMin) mesh.position.x = mesh.position.x >= 0 ? marginMin : -marginMin;
        });
    }

    _respawnText(mesh) {
        const ud = mesh.userData;
        const newText = this.config.textPool[Math.floor(Math.random() * this.config.textPool.length)];

        const oldTexture = ud.texture;
        const newTexture = this._createTextTexture(newText);

        const aspect = newTexture.image.width / newTexture.image.height;
        const height = 2.5 + Math.random() * 1.5;
        const width = height * aspect;

        ud.geometry.dispose();
        oldTexture.dispose();

        mesh.geometry = new THREE.PlaneGeometry(width, height);
        mesh.material.map = newTexture;
        mesh.material.needsUpdate = true;
        ud.texture = newTexture;
        ud.geometry = mesh.geometry;

        const pos = this._marginPosition();
        mesh.position.set(pos.x, pos.y, pos.z);
        ud.baseY = pos.y;
        mesh.rotation.y = 0;

        ud.state = 'entering';
        ud.lifetime = 0;
        ud.delay = 0;
        ud.maxOpacity = 0.05 + Math.random() * 0.12;
        ud.fadeInSpeed = 0.005 + Math.random() * 0.025;
        ud.fadeOutSpeed = 0.005 + Math.random() * 0.02;
        ud.activeDuration = 4 + Math.random() * 8;
    }

    _updateParticles(delta) {
        if (!this.particles) return;

        const positions = this.particles.geometry.attributes.position.array;

        for (let i = 0; i < this.config.particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += this.particleVelocities[i3];
            positions[i3 + 1] += this.particleVelocities[i3 + 1];
            positions[i3 + 2] += this.particleVelocities[i3 + 2];

            if (Math.abs(positions[i3]) > 40) this.particleVelocities[i3] *= -1;
            if (Math.abs(positions[i3 + 1]) > 30) this.particleVelocities[i3 + 1] *= -1;
            if (Math.abs(positions[i3 + 2]) > 25) this.particleVelocities[i3 + 2] *= -1;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    _animate() {
        if (!this.isRunning) return;

        this.animationId = requestAnimationFrame(() => this._animate());

        const delta = this.clock.getDelta();

        this._updateTextMeshes(delta);
        this._updateParticles(delta);

        if (this.config.mode === 'intro') {
            if (!this.fadeStartTime) {
                this.fadeStartTime = Date.now();
            }
            const elapsed = Date.now() - this.fadeStartTime;
            if (elapsed > this.config.introDuration) {
                const fadeProgress = Math.min((elapsed - this.config.introDuration) / 1500, 1);
                this.renderer.setClearColor(
                    new THREE.Color(this.config.bgColor),
                    1 - fadeProgress
                );
                this.particles.material.opacity = 0.3 * (1 - fadeProgress);
                this.textMeshes.forEach(mesh => {
                    mesh.material.opacity *= (1 - fadeProgress * 0.5);
                });
                if (fadeProgress >= 1) {
                    this.dispose();
                    if (this.canvas.parentNode) {
                        this.canvas.parentNode.removeChild(this.canvas);
                    }
                    return;
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.textMeshes.forEach(mesh => {
            if (mesh.userData.texture) mesh.userData.texture.dispose();
            if (mesh.userData.geometry) mesh.userData.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });

        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        this.textMeshes = [];
        if (this.renderer) {
            this.renderer.dispose();
        }
    }

    resize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
