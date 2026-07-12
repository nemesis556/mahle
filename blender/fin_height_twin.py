"""Blender 4.x script: builds a presentable radiator-fin inspection station.
Open Blender > Scripting > Open this file > Run Script. Export as GLB for a real Three.js model.
"""
import bpy
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def mat(name, color, metallic=0.0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.metallic=metallic; m.roughness=.28; return m
metal=mat('Brushed aluminium',(.42,.50,.55),.8); dark=mat('Machine dark',(.035,.075,.095),.55); mint=mat('Laser mint',(.12,1,.78),.15); danger=mat('LVDT contact',(.95,.12,.08),.3)
def cube(name, loc, scale, material, bevel=.0):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.name=name; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(material)
    if bevel: mod=o.modifiers.new('Edge soften','BEVEL'); mod.width=bevel; mod.segments=3
    return o
base=cube('Radiator core base',(0,0,0),(4.6,1.2,.22),dark,.08)
for i in range(10):
    fin=cube(f'Fin {i+1}',(-3.6+i*.8,0,.9),(.025,1.03,.9),metal,.015)
    fin.rotation_euler[1]=-.12
cube('Optical-head bridge',(0,0,3.1),(3.7,.12,.12),dark,.05)
head=cube('Laser triangulation head',(0,0,2.72),(.34,.34,.28),dark,.08)
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=(0,-.35,2.72), scale=(.08,.08,.08)); bpy.context.object.data.materials.append(mint); bpy.context.object.name='Laser aperture'
cube('Laser beam',(0,-.35,1.55),(.012,.012,1.1),mint)
for x in (-3.6,3.6): cube('Support', (x,0,2),(.12,.15,1.2),dark,.04)
bpy.ops.object.light_add(type='AREA', location=(1,-4,5)); bpy.context.object.data.energy=900; bpy.context.object.data.shape='DISK'; bpy.context.object.data.size=5
bpy.ops.object.camera_add(location=(8,-10,6)); cam=bpy.context.object; bpy.context.scene.camera=cam
def look(obj, target): obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
look(cam,(0,0,1.2)); bpy.context.scene.render.engine='BLENDER_EEVEE_NEXT'; bpy.context.scene.render.resolution_x=1600; bpy.context.scene.render.resolution_y=900; bpy.context.scene.world.color=(.01,.02,.03)
